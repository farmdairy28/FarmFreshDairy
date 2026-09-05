'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Category } from '@/lib/types';
import { CategorySchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function saveCategoryAction(
  categoryData: Partial<Category>
): Promise<{ success: boolean; category?: Category; error?: string }> {
  try {
    const slug = categoryData.slug || categoryData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    
    const validated = CategorySchema.safeParse({
      ...categoryData,
      slug,
    });

    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid category data' };
    }

    const adminClient = createAdminClient();

    const payload = {
      name: validated.data.name,
      slug: validated.data.slug,
      description: validated.data.description || null,
      sort_order: validated.data.sort_order || 1,
      is_active: validated.data.is_active !== undefined ? validated.data.is_active : true,
      updated_at: new Date().toISOString(),
    };

    if (categoryData.id && !categoryData.id.startsWith('c-') && !categoryData.id.startsWith('cat-')) {
      // Update existing record
      const { data, error } = await adminClient
        .from('categories')
        .update(payload)
        .eq('id', categoryData.id)
        .select()
        .single();

      if (error) {
        console.error('Update category error:', error);
        return { success: false, error: error.message };
      }

      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/categories');
      revalidatePath('/admin/products');
      return { success: true, category: data as Category };
    } else {
      // Create new record
      const { data, error } = await adminClient
        .from('categories')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();

      if (error) {
        console.error('Insert category error:', error);
        return { success: false, error: error.message };
      }

      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/categories');
      revalidatePath('/admin/products');
      return { success: true, category: data as Category };
    }
  } catch (err: any) {
    console.error('Category action exception:', err);
    return { success: false, error: err?.message || 'Failed to save category.' };
  }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Delete category error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    console.error('Delete category exception:', err);
    return { success: false, error: err?.message || 'Failed to delete category.' };
  }
}
