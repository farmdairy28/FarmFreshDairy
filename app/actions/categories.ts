'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Category } from '@/lib/types';
import { CategorySchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { upsertServerCategory, deleteServerCategory } from '@/lib/supabase/products-store';

function extractMissingColumn(errorMsg?: string): string | null {
  if (!errorMsg) return null;
  // PostgREST: "Could not find the 'is_active' column of 'categories' in the schema cache"
  const match = errorMsg.match(/Could not find the '([^']+)' column/i);
  return match ? match[1] : null;
}

export async function saveCategoryAction(
  categoryData: Partial<Category>
): Promise<{ success: boolean; category?: Category; error?: string }> {
  try {
    const slug =
      categoryData.slug ||
      categoryData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      '';

    const validated = CategorySchema.safeParse({
      ...categoryData,
      slug,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid category data' };
    }

    const adminClient = createAdminClient();
    const baseCategoryPayload: Record<string, any> = {
      name: validated.data.name,
      slug: validated.data.slug,
      description: validated.data.description || null,
      sort_order: validated.data.sort_order || 1,
      is_active: validated.data.is_active !== undefined ? validated.data.is_active : true,
    };

    let savedCategoryRecord: Category | null = null;

    if (adminClient) {
      if (categoryData.id && !categoryData.id.startsWith('c-') && !categoryData.id.startsWith('cat-')) {
        // UPDATE EXISTING RECORD WITH RETRY
        let updatePayload: Record<string, any> = {
          ...baseCategoryPayload,
          updated_at: new Date().toISOString(),
        };
        let updateError: any = null;

        for (let attempt = 0; attempt < 6; attempt++) {
          const res = await adminClient
            .from('categories')
            .update(updatePayload)
            .eq('id', categoryData.id)
            .select()
            .single();

          if (!res.error && res.data) {
            savedCategoryRecord = {
              ...baseCategoryPayload,
              ...res.data,
              is_active: res.data.is_active !== undefined ? res.data.is_active : baseCategoryPayload.is_active,
            } as Category;
            updateError = null;
            break;
          }

          updateError = res.error;
          const missingCol = extractMissingColumn(res.error?.message);
          if (missingCol && missingCol in updatePayload) {
            delete updatePayload[missingCol];
            continue;
          }

          break;
        }

        if (updateError || !savedCategoryRecord) {
          console.error('[DB Category Update Error]:', updateError);
          // Fallback to local record if DB fails
          savedCategoryRecord = {
            id: categoryData.id,
            name: baseCategoryPayload.name,
            slug: baseCategoryPayload.slug,
            description: baseCategoryPayload.description,
            sort_order: baseCategoryPayload.sort_order,
            is_active: baseCategoryPayload.is_active,
          };
        }
      } else {
        // INSERT NEW RECORD WITH RETRY
        let insertPayload: Record<string, any> = {
          ...baseCategoryPayload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        let insertError: any = null;

        for (let attempt = 0; attempt < 6; attempt++) {
          const res = await adminClient
            .from('categories')
            .insert(insertPayload)
            .select()
            .single();

          if (!res.error && res.data) {
            savedCategoryRecord = {
              ...baseCategoryPayload,
              ...res.data,
              is_active: res.data.is_active !== undefined ? res.data.is_active : baseCategoryPayload.is_active,
            } as Category;
            insertError = null;
            break;
          }

          insertError = res.error;
          const missingCol = extractMissingColumn(res.error?.message);
          if (missingCol && missingCol in insertPayload) {
            delete insertPayload[missingCol];
            continue;
          }

          break;
        }

        if (insertError || !savedCategoryRecord) {
          console.error('[DB Category Insert Error]:', insertError);
          // If insert failed due to DB connection or permissions, fall back to memory
          const newId = categoryData.id || `cat-${Date.now()}`;
          savedCategoryRecord = {
            id: newId,
            name: baseCategoryPayload.name,
            slug: baseCategoryPayload.slug,
            description: baseCategoryPayload.description,
            sort_order: baseCategoryPayload.sort_order,
            is_active: baseCategoryPayload.is_active,
          };
        }
      }
    } else {
      // IN-MEMORY SERVER FALLBACK
      const newId = categoryData.id || `cat-${Date.now()}`;
      savedCategoryRecord = {
        id: newId,
        name: baseCategoryPayload.name,
        slug: baseCategoryPayload.slug,
        description: baseCategoryPayload.description,
        sort_order: baseCategoryPayload.sort_order,
        is_active: baseCategoryPayload.is_active,
      };
    }

    // Authoritatively sync with server memory store
    if (savedCategoryRecord) {
      upsertServerCategory(savedCategoryRecord);
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'layout');
      revalidatePath('/products', 'page');
      revalidatePath('/admin/categories', 'page');
      revalidatePath('/admin/products', 'page');
    } catch (e) {}

    return { success: true, category: savedCategoryRecord as Category };
  } catch (err: any) {
    console.error('Category action exception:', err);
    return { success: false, error: err?.message || 'Failed to save category.' };
  }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    deleteServerCategory(categoryId);

    const adminClient = createAdminClient();
    if (adminClient) {
      await adminClient.from('categories').delete().eq('id', categoryId);
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'layout');
      revalidatePath('/products', 'page');
      revalidatePath('/admin/categories', 'page');
      revalidatePath('/admin/products', 'page');
    } catch (e) {}

    return { success: true };
  } catch (err: any) {
    console.error('Delete category exception:', err);
    return { success: false, error: err?.message || 'Failed to delete category.' };
  }
}

