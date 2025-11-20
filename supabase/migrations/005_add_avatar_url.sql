-- Add avatar_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to avatars
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );
