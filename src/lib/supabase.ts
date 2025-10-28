import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export async function uploadImageToStorage(file: File, folder: string): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client is not initialized.');
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public-assets') // Using the specified bucket name
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError.message);
    return null;
  }

  const { data } = supabase.storage
    .from('public-assets')
    .getPublicUrl(filePath);

  return data?.publicUrl || null;
}

export { supabase };
