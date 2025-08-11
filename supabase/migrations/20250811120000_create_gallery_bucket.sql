-- Create gallery bucket if not exists
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Allow anyone to read objects in the gallery bucket
create policy if not exists "Public can read gallery"
  on storage.objects for select
  to public
  using (bucket_id = 'gallery');

-- Allow public to insert objects into the gallery bucket (client-side uploads)
create policy if not exists "Public can upload to gallery"
  on storage.objects for insert
  to public
  with check (bucket_id = 'gallery');

-- Allow public to update objects in the gallery bucket (optional; can be tightened later)
create policy if not exists "Public can update gallery"
  on storage.objects for update
  to public
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

-- Allow public to delete objects in the gallery bucket (optional; can be tightened later)
create policy if not exists "Public can delete gallery"
  on storage.objects for delete
  to public
  using (bucket_id = 'gallery');