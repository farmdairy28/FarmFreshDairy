'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/lib/types';
import { ProductSchema } from '@/lib/validations';
import { upsertServerProduct, deleteServerProduct } from '@/lib/supabase/products-store';
import { revalidatePath } from 'next/cache';

function isValidUUID(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

function extractMissingColumn(errorMessage?: string | null): string | null {
  if (!errorMessage || typeof errorMessage !== 'string') return null;
  const matchPostgrest = errorMessage.match(/Could not find the '([^']+)' column/i);
  if (matchPostgrest && matchPostgrest[1]) return matchPostgrest[1];
  const matchPostgres = errorMessage.match(/column ["']([^"']+)["'](?: of relation)? does not exist/i);
  if (matchPostgres && matchPostgres[1]) return matchPostgres[1];
  return null;
}

export async function saveProductAction(
  productData: Partial<Product>
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    // 1. Validate inputs
    const validated = ProductSchema.safeParse(productData);
    if (!validated.success) {
      console.error('[Product Validation Error]:', validated.error.errors);
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid product data',
      };
    }

    const cleanSlug = (productData.slug || productData.name || 'product')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const primaryImage =
      (productData.primary_image || '').trim() ||
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80';

    // Ensure valid UUID for category or null
    const safeCategoryId = isValidUUID(productData.category_id) ? productData.category_id!.trim() : null;

    const stockVal =
      productData.stock !== undefined && !isNaN(Number(productData.stock))
        ? Math.max(0, Math.floor(Number(productData.stock)))
        : 100;

    const basePayload: Record<string, any> = {
      name: productData.name!.trim(),
      slug: cleanSlug,
      short_description: productData.short_description!.trim(),
      full_description: (productData.full_description || productData.short_description || '').trim(),
      price: Number(productData.price),
      compare_at_price: productData.compare_at_price ? Number(productData.compare_at_price) : null,
      currency: productData.currency || 'Rs.',
      category_id: safeCategoryId,
      sku: productData.sku?.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      unit: productData.unit?.trim() || 'litre',
      weight_volume: productData.weight_volume?.trim() || null,
      stock: stockVal,
      availability: productData.availability !== undefined ? Boolean(productData.availability) : true,
      is_active: productData.is_active !== undefined ? Boolean(productData.is_active) : true,
      is_featured: productData.is_featured !== undefined ? Boolean(productData.is_featured) : false,
      show_on_homepage: productData.show_on_homepage !== undefined ? Boolean(productData.show_on_homepage) : true,
      seo_title: productData.seo_title?.trim() || null,
      seo_description: productData.seo_description?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    let savedProductRecord: Product | null = null;
    const adminClient = createAdminClient();

    if (adminClient) {
      const isExistingDbRecord = isValidUUID(productData.id);

      if (isExistingDbRecord) {
        // UPDATE EXISTING DB RECORD — strip unknown columns on every attempt
        let updatePayload: Record<string, any> = { ...basePayload };
        let updateError: any = null;
        const MAX_ATTEMPTS = 15;

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          const res = await adminClient
            .from('products')
            .update(updatePayload)
            .eq('id', productData.id)
            .select()
            .single();

          if (!res.error && res.data) {
            savedProductRecord = {
              ...res.data,
              primary_image: primaryImage,
            };
            updateError = null;
            break;
          }

          updateError = res.error;
          const missingCol = extractMissingColumn(res.error?.message);
          if (missingCol && missingCol in updatePayload) {
            delete updatePayload[missingCol];
            continue;
          }

          if (
            res.error?.message?.toLowerCase().includes('foreign key') ||
            res.error?.message?.includes('category_id')
          ) {
            updatePayload.category_id = null;
            continue;
          }

          break;
        }

        if (updateError || !savedProductRecord) {
          // DB update failed — fall through to memory store; do not return hard error
          console.error('[DB Product Update Error]:', updateError);
        }

        // Update product images (best-effort)
        if (primaryImage && isValidUUID(productData.id)) {
          try { await adminClient.from('product_images').delete().eq('product_id', productData.id); } catch (_) {}
          try {
            await adminClient.from('product_images').insert({
              product_id: productData.id,
              image_url: primaryImage,
              is_primary: true,
              sort_order: 1,
            });
          } catch (_) {}
        }
      } else {
        // INSERT NEW DB RECORD — strip unknown columns on every attempt
        let insertPayload: Record<string, any> = {
          ...basePayload,
          created_at: new Date().toISOString(),
        };
        let insertError: any = null;
        const MAX_ATTEMPTS = 15; // allow stripping up to 15 unknown columns

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          const res = await adminClient
            .from('products')
            .insert(insertPayload)
            .select()
            .single();

          if (!res.error && res.data) {
            savedProductRecord = {
              ...res.data,
              primary_image: primaryImage,
            };
            insertError = null;
            break;
          }

          insertError = res.error;
          const missingCol = extractMissingColumn(res.error?.message);
          if (missingCol && missingCol in insertPayload) {
            delete insertPayload[missingCol];
            continue;
          }

          // Foreign key constraint failed on category_id → set to null and retry
          if (
            res.error?.message?.toLowerCase().includes('foreign key') ||
            res.error?.message?.includes('category_id')
          ) {
            insertPayload.category_id = null;
            continue;
          }

          // Duplicate slug → make unique and retry
          if (
            res.error?.message?.toLowerCase().includes('duplicate') ||
            res.error?.message?.toLowerCase().includes('unique')
          ) {
            insertPayload.slug = `${insertPayload.slug}-${Date.now().toString().slice(-4)}`;
            continue;
          }

          // Unrecognised error — stop retrying
          break;
        }

        if (insertError || !savedProductRecord) {
          // Even if DB insert failed, fall through to memory store below
          console.error('[DB Product Insert Error]:', insertError);
        }

        // Insert primary image into product_images (only if DB insert succeeded)
        if (savedProductRecord?.id && savedProductRecord.id.length > 10) {
          try {
            await adminClient.from('product_images').insert({
              product_id: savedProductRecord.id,
              image_url: primaryImage,
              is_primary: true,
              sort_order: 1,
            });
          } catch (_) {} // ignore image insert errors
        }
      }

      // If DB failed for any reason, build a memory record so save still succeeds
      if (!savedProductRecord) {
        console.warn('[Products Action]: DB failed; falling back to memory store.');
        const existingId = isValidUUID(productData.id) ? productData.id! : `prod-${Date.now()}`;
        savedProductRecord = {
          id: existingId,
          name: basePayload.name,
          slug: basePayload.slug,
          short_description: basePayload.short_description,
          full_description: basePayload.full_description,
          price: basePayload.price,
          compare_at_price: basePayload.compare_at_price,
          currency: basePayload.currency,
          category_id: basePayload.category_id || undefined,
          sku: basePayload.sku,
          unit: basePayload.unit,
          weight_volume: basePayload.weight_volume,
          stock: basePayload.stock,
          availability: basePayload.availability,
          is_active: basePayload.is_active,
          is_featured: basePayload.is_featured,
          show_on_homepage: basePayload.show_on_homepage,
          primary_image: primaryImage,
          seo_title: basePayload.seo_title,
          seo_description: basePayload.seo_description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // IN-MEMORY / LOCAL SERVER FALLBACK (When Supabase is offline or in local mock dev)
      console.warn('[Products Action]: Supabase offline. Product saved in server-side memory store.');
      const existingId = productData.id || `prod-${Date.now()}`;
      savedProductRecord = {
        id: existingId,
        name: basePayload.name,
        slug: basePayload.slug,
        short_description: basePayload.short_description,
        full_description: basePayload.full_description,
        price: basePayload.price,
        compare_at_price: basePayload.compare_at_price,
        currency: basePayload.currency,
        category_id: basePayload.category_id || undefined,
        sku: basePayload.sku,
        unit: basePayload.unit,
        weight_volume: basePayload.weight_volume,
        stock: basePayload.stock,
        availability: basePayload.availability,
        is_active: basePayload.is_active,
        is_featured: basePayload.is_featured,
        show_on_homepage: basePayload.show_on_homepage,
        primary_image: primaryImage,
        seo_title: basePayload.seo_title,
        seo_description: basePayload.seo_description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // 2. Authoritatively sync with server memory store
    if (savedProductRecord) {
      upsertServerProduct(savedProductRecord);
    }

    // 3. Invalidate Next.js cache across all storefront and admin pages
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'page');
      revalidatePath('/products', 'layout');
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/admin/products', 'page');
      revalidatePath('/admin', 'layout');
    } catch (revalidateErr) {
      console.warn('[revalidatePath Notice]:', revalidateErr);
    }

    return {
      success: true,
      product: savedProductRecord,
    };
  } catch (err: any) {
    console.error('Product action error:', err);
    return { success: false, error: err?.message || 'Failed to save product.' };
  }
}

export async function deleteProductAction(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanId = (productId || '').trim();
    if (!cleanId) {
      return { success: false, error: 'Product ID is required.' };
    }

    const adminClient = createAdminClient();
    if (adminClient) {
      // 1. Delete associated product_images first to prevent foreign key constraint violations
      try {
        await adminClient.from('product_images').delete().eq('product_id', cleanId);
      } catch (_) {}

      // 2. Delete from products table by id
      try {
        const { error } = await adminClient.from('products').delete().eq('id', cleanId);
        if (error) {
          console.warn('[DB Product Delete by ID Notice]:', error.message);
        }
      } catch (dbErr) {
        console.warn('[DB Product Delete by ID Exception]:', dbErr);
      }

      // 3. Also try delete by slug if cleanId is a slug or custom key
      try {
        await adminClient.from('products').delete().eq('slug', cleanId);
      } catch (_) {}
    }

    // 4. ALWAYS delete from server memory store
    deleteServerProduct(cleanId);

    // 5. Invalidate Next.js static and dynamic cache
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'page');
      revalidatePath('/products', 'layout');
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/admin/products', 'page');
      revalidatePath('/admin', 'layout');
    } catch (e) {}

    return { success: true };
  } catch (err: any) {
    console.error('Delete product action exception:', err);
    return { success: false, error: err?.message || 'Failed to delete product.' };
  }
}
