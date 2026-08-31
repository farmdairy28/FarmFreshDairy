'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface UploadResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: `Invalid file type "${file.type}". Allowed: JPG, PNG, WEBP, GIF.` };
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'File size exceeds 5MB limit.' };
  }

  try {
    const adminClient = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `products/${cleanFileName}`;

    const { data, error } = await adminClient.storage
      .from('product-images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = adminClient.storage
      .from('product-images')
      .getPublicUrl(storagePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      storagePath,
    };
  } catch (err: any) {
    console.error('Upload exception:', err);
    return { success: false, error: err?.message || 'Failed to upload image.' };
  }
}
