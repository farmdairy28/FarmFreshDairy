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

    const shortDesc = (productData.short_description || (productData as any).description || '').trim();
    const fullDesc = (productData.full_description || (productData as any).description || productData.short_description || '').trim();

    if (!shortDesc) {
      return {
        success: false,
        error: 'Short description is required',
      };
    }

    const basePayload: Record<string, any> = {
      name: productData.name!.trim(),
      slug: cleanSlug,
      short_description: shortDesc,
      full_description: fullDesc,
      description: shortDesc || fullDesc,
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
              short_description: res.data.short_description || res.data.description || shortDesc,
              full_description: res.data.full_description || res.data.description || fullDesc || shortDesc,
              description: res.data.description || res.data.short_description || res.data.full_description || shortDesc,
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
          const errMsg = updateError?.message || 'Unknown DB update error';
          console.error('[DB Product Update Error]:', errMsg);
          return { success: false, error: `Database update failed: ${errMsg}` };
        }

        // Update product images (best-effort)
        if (primaryImage && isValidUUID(productData.id)) {
          try { await adminClient.from('product_images').delete().eq('product_id', productData.id); } catch (_) { }
          try {
            await adminClient.from('product_images').insert({
              product_id: productData.id,
              image_url: primaryImage,
              is_primary: true,
              sort_order: 1,
            });
          } catch (_) { }
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
              short_description: res.data.short_description || res.data.description || shortDesc,
              full_description: res.data.full_description || res.data.description || fullDesc || shortDesc,
              description: res.data.description || res.data.short_description || res.data.full_description || shortDesc,
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
          const errMsg = insertError?.message || 'Unknown DB insert error';
          console.error('[DB Product Insert Error]:', errMsg);
          return { success: false, error: `Database insert failed: ${errMsg}` };
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
          } catch (_) { } // ignore image insert errors
        }
      }

    } else {
      // Supabase admin client not configured
      console.error('[Products Action]: Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
      return { success: false, error: 'Supabase is not configured. Please check your .env.local file (SUPABASE_SERVICE_ROLE_KEY).' };
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

    // 1. Always remove from server memory store immediately
    deleteServerProduct(cleanId);

    // 2. Obtain candidate Supabase clients (Service Role Key and/or Authenticated Server Session)
    const clients: any[] = [];
    try {
      const adminClient = createAdminClient();
      if (adminClient) clients.push(adminClient);
    } catch (e) {}

    try {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const serverAuthClient = createServerSupabaseClient();
      if (serverAuthClient) clients.push(serverAuthClient);
    } catch (e) {}

    let deletedSuccessfully = false;
    let lastError: string | null = null;

    for (const client of clients) {
      try {
        let dbId: string | null = isValidUUID(cleanId) ? cleanId : null;
        let dbSlug: string | null = cleanId;

        // Lookup product to get both ID and slug
        try {
          let query = client.from('products').select('id, slug');
          if (isValidUUID(cleanId)) {
            query = query.eq('id', cleanId);
          } else {
            query = query.eq('slug', cleanId);
          }
          const { data: found } = await query.maybeSingle();
          if (found) {
            dbId = found.id || dbId;
            dbSlug = found.slug || dbSlug;
          }
        } catch (e) {}

        if (dbId) {
          deleteServerProduct(dbId);
        }
        if (dbSlug) {
          deleteServerProduct(dbSlug);
        }

        // Clean up FKs in order_items and product_images
        if (dbId) {
          try {
            await client.from('order_items').update({ product_id: null }).eq('product_id', dbId);
          } catch (e) {}
          try {
            await client.from('product_images').delete().eq('product_id', dbId);
          } catch (e) {}
        }
        if (cleanId && cleanId !== dbId) {
          try {
            await client.from('order_items').update({ product_id: null }).eq('product_id', cleanId);
          } catch (e) {}
          try {
            await client.from('product_images').delete().eq('product_id', cleanId);
          } catch (e) {}
        }

        // 1st: Try Hard DELETE
        if (dbId) {
          const { error: delErr } = await client.from('products').delete().eq('id', dbId);
          if (!delErr) {
            deletedSuccessfully = true;
          } else {
            lastError = delErr.message;
          }
        }
        if (!deletedSuccessfully && dbSlug) {
          const { error: delSlugErr } = await client.from('products').delete().eq('slug', dbSlug);
          if (!delSlugErr) {
            deletedSuccessfully = true;
          } else {
            lastError = delSlugErr.message;
          }
        }

        // 2nd: Immediate soft-delete / deactivation fallback (ensures storefront NEVER returns it)
        if (dbId) {
          await client
            .from('products')
            .update({ is_active: false, availability: false, show_on_homepage: false })
            .eq('id', dbId);
        }
        if (dbSlug) {
          await client
            .from('products')
            .update({ is_active: false, availability: false, show_on_homepage: false })
            .eq('slug', dbSlug);
        }
        if (cleanId && cleanId !== dbId) {
          await client
            .from('products')
            .update({ is_active: false, availability: false, show_on_homepage: false })
            .eq('id', cleanId);
        }
      } catch (err: any) {
        lastError = err?.message || 'Database error during deletion';
      }
    }

    // 3. Invalidate Next.js cache so all pages reflect the deletion immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/products', 'layout');
      revalidatePath('/products', 'page');
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
