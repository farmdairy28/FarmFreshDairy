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
const BUCKET_NAME = 'product-images';

/**
 * Ensures the 'product-images' bucket exists and is public in Supabase Storage.
 * Attempts to automatically create it via the admin API if not found.
 */
async function ensureBucketExists(adminClient: any): Promise<boolean> {
  try {
    const { data: bucket, error: getError } = await adminClient.storage.getBucket(BUCKET_NAME);
    if (!getError && bucket) {
      return true;
    }

    // Try creating the bucket
    console.log(`[Storage]: Bucket '${BUCKET_NAME}' not found. Attempting automatic creation...`);
    const { data: createData, error: createError } = await adminClient.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    });

    if (createError) {
      if (createError.message?.toLowerCase().includes('already exists')) {
        return true;
      }
      console.warn(`[Storage Auto-Create Warning]:`, createError.message);
      return false;
    }

    console.log(`[Storage Success]: Automatically created public bucket '${BUCKET_NAME}'.`);
    return true;
  } catch (err) {
    console.warn(`[Storage Bucket Verification Exception]:`, err);
    return false;
  }
}

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
    if (!adminClient) {
      return { 
        success: false, 
        error: 'Supabase storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment, or paste an image URL directly.' 
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `products/${cleanFileName}`;

    // 1. First upload attempt
    let { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    // 2. If bucket not found, attempt auto-creation and retry
    if (error) {
      const errMsg = (error.message || '').toLowerCase();
      if (errMsg.includes('bucket not found') || errMsg.includes('not found') || (error as any).statusCode === '404') {
        const created = await ensureBucketExists(adminClient);
        if (created) {
          const retryRes = await adminClient.storage
            .from(BUCKET_NAME)
            .upload(storagePath, buffer, {
              contentType: file.type,
              upsert: false,
            });
          data = retryRes.data;
          error = retryRes.error;
        }
      }
    }

    if (error) {
      console.error('Storage upload error:', error);
      const isBucketError = (error.message || '').toLowerCase().includes('bucket not found');
      return { 
        success: false, 
        error: isBucketError
          ? `Storage bucket '${BUCKET_NAME}' does not exist in your Supabase project. Please run 'supabase/migrations/20260905_create_storage_bucket.sql' in the Supabase SQL Editor to create it, or paste an image URL directly into the field below.`
          : error.message 
      };
    }

    const { data: publicUrlData } = adminClient.storage
      .from(BUCKET_NAME)
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
