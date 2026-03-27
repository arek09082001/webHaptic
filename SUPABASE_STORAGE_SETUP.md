# Supabase Storage Setup for Clubs

This document explains how to set up the Supabase Storage bucket required for the clubs feature.

## Steps

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `club-assets`
   - **Public bucket**: Toggle ON (allows public access to uploaded logos)
   - Click **Create bucket**

### 2. (Optional) Configure RLS Policies

If you want more granular control over who can upload/access files, you can set up Row Level Security policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload club logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'club-assets');

-- Allow anyone to read club logos (public access)
CREATE POLICY "Anyone can view club logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'club-assets');

-- Only admins can delete (you'd need to check club_members table)
CREATE POLICY "Only admins can delete club logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'club-assets');
```

### 3. Verify Setup

After creating the bucket, verify it works by:

1. Navigating to `/clubs` in your application
2. Creating a new club with a logo
3. Checking that the logo appears correctly in the club selector

## Troubleshooting

### "Bucket not found" error
- Ensure the bucket name is exactly `club-assets`
- Check that the bucket is created in the correct Supabase project

### Images not loading
- Verify the bucket is set to **public**
- Check browser console for CORS errors
- Ensure your Supabase URL is correct in environment variables

### Upload fails
- Check that your `SUPABASE_SERVICE_ROLE_KEY` has proper permissions
- Verify the bucket exists and is accessible
- Check file size limits (default is 50MB in Supabase)

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
