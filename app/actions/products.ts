'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/lib/types';
import { ProductSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function saveProductAction(productData: Partial<Product>): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    // Validate inputs
    const validated = ProductSchema.safeParse(productData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid product data' };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: 'Supabase database client is not configured.' };
    }

    const payload = {
      name: productData.name!,
      slug: productData.slug!,
      short_description: productData.short_description!,
      full_description: productData.full_description || '',
      price: Number(productData.price),
      compare_at_price: productData.compare_at_price ? Number(productData.compare_at_price) : null,
      currency: productData.currency || 'Rs.',
      category_id: productData.category_id || null,
      sku: productData.sku || null,
      unit: productData.unit || 'litre',
      weight_volume: productData.weight_volume || null,
      stock: Number(productData.stock) || 0,
      availability: productData.availability !== undefined ? productData.availability : true,
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      is_featured: productData.is_featured !== undefined ? productData.is_featured : false,
      show_on_homepage: productData.show_on_homepage !== undefined ? productData.show_on_homepage : true,
      seo_title: productData.seo_title || null,
      seo_description: productData.seo_description || null,
      updated_at: new Date().toISOString(),
    };

    if (productData.id && !productData.id.startsWith('p-')) {
      // Update existing record
      const { data, error } = await adminClient
        .from('products')
        .update(payload)
        .eq('id', productData.id)
        .select()
        .single();

      if (error) {
        console.error('Database product update error:', error);
        return { success: false, error: error.message };
      }

      // Update primary image if provided
      if (productData.primary_image) {
        await adminClient
          .from('product_images')
          .delete()
          .eq('product_id', productData.id);

        await adminClient
          .from('product_images')
          .insert({
            product_id: productData.id,
            image_url: productData.primary_image,
            is_primary: true,
            sort_order: 1,
          });
      }

      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/admin/products');
      return { success: true, product: data as Product };
    } else {
      // Create new record
      const { data, error } = await adminClient
        .from('products')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();

      if (error) {
        console.error('Database product insert error:', error);
        return { success: false, error: error.message };
      }

      // Insert primary image
      if (productData.primary_image && data?.id) {
        await adminClient
          .from('product_images')
          .insert({
            product_id: data.id,
            image_url: productData.primary_image,
            is_primary: true,
            sort_order: 1,
          });
      }

      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/admin/products');
      return { success: true, product: data as Product };
    }
  } catch (err: any) {
    console.error('Product action error:', err);
    return { success: false, error: err?.message || 'Failed to save product.' };
  }
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: 'Supabase database client is not configured.' };
    }

    const { error } = await adminClient
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Delete product error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/products/[slug]', 'page');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    console.error('Delete product action exception:', err);
    return { success: false, error: err?.message || 'Failed to delete product.' };
  }
}
