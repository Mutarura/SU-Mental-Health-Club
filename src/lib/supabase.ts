import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ✅ Initialize Supabase client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload image to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder name inside the 'public-assets' bucket
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadImageToStorage(file: File, folder: string): Promise<string | null> {
  if (!file) {
    console.error('No file selected for upload.');
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('public-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }

  // ✅ Generate a public URL
  const { data: publicUrlData } = supabase.storage
    .from('public-assets')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl || null;
}

/**
 * Example CRUD Functions (Events Table)
 */

// CREATE
export async function createEvent(eventData: any) {
  const { data, error } = await supabase.from('events').insert([eventData]);
  if (error) throw error;
  return data;
}

// READ
export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// UPDATE
export async function updateEvent(id: number, updates: any) {
  const { data, error } = await supabase.from('events').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

// DELETE
export async function deleteEvent(id: number) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  return true;
}
