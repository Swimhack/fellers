import { supabase } from '@/integrations/supabase/client';

export type UploadResult = {
  path: string;
  publicUrl: string;
};

const BUCKET = 'gallery';
const FOLDER = 'uploads';

export function generateUniqueFileName(originalName: string, extensionFallback = 'jpg'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const cleaned = originalName
    .replace(/[^a-zA-Z0-9-_\.]/g, '-')
    .replace(/\.+/, '.')
    .toLowerCase();
  const hasExt = /\.[a-z0-9]{2,5}$/.test(cleaned);
  const base = hasExt ? cleaned : `${cleaned || 'image'}.${extensionFallback}`;
  return `${timestamp}_${random}_${base}`;
}

export async function uploadImageBlob(blob: Blob, fileName: string): Promise<UploadResult> {
  const key = `${FOLDER}/${generateUniqueFileName(fileName)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(key, blob, {
    cacheControl: '31536000',
    upsert: false,
    contentType: blob.type || 'image/jpeg',
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return { path: key, publicUrl: data.publicUrl };
}

export type ListedImage = {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  publicUrl: string;
  path: string;
};

export async function listGalleryImages(limit = 100): Promise<ListedImage[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, {
    limit,
  });
  if (error) throw error;
  const list = (data || []).filter((f) => f && !f.name.endsWith('/'));
  return list.map((f) => {
    const path = `${FOLDER}/${f.name}`;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return {
      name: f.name,
      id: (f as any).id,
      created_at: (f as any).created_at,
      updated_at: (f as any).updated_at,
      last_accessed_at: (f as any).last_accessed_at,
      publicUrl: urlData.publicUrl,
      path,
    };
  });
}