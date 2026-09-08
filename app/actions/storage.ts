'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface UploadResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  error?: string;
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'jfif'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const BUCKET_NAME = 'product-images';

function resolveMimeType(fileName: string, mimeType?: string): string | null {
  const normalizedMime = (mimeType || '').toLowerCase().trim();
  const ext = (fileName.split('.').pop() || '').toLowerCase().trim();

  if (normalizedMime.startsWith('image/')) {
    if (normalizedMime.includes('png') || normalizedMime.includes('x-png')) return 'image/png';
    if (normalizedMime.includes('webp')) return 'image/webp';
    if (normalizedMime.includes('gif')) return 'image/gif';
    if (normalizedMime.includes('avif')) return 'image/avif';
    return 'image/jpeg';
  }

  if (ALLOWED_EXTENSIONS.includes(ext)) {
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    if (ext === 'gif') return 'image/gif';
    if (ext === 'avif') return 'image/avif';
    return 'image/jpeg';
  }

  return null;
}

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
    const { error: createError } = await adminClient.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif'],
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

  const finalMimeType = resolveMimeType(file.name, file.type);
  if (!finalMimeType) {
    return { success: false, error: `Invalid image file format. Allowed: JPG, PNG, WEBP, GIF, AVIF.` };
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'File size exceeds 10MB limit.' };
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

    const ext = (file.name.split('.').pop() || '').toLowerCase().trim() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `products/${cleanFileName}`;

    // 1. First upload attempt
    let { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: finalMimeType,
        upsert: true,
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
              contentType: finalMimeType,
              upsert: true,
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
          ? `Storage bucket '${BUCKET_NAME}' does not exist in your Supabase project. Please ensure bucket '${BUCKET_NAME}' is created as public in Supabase Storage.`
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

