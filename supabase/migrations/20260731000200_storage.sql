-- Create storage bucket for avatars and media
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own avatar
create policy "avatars_upload_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = split_part(name, '/', 1)
);

create policy "avatars_select_public"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "avatars_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars' and
  owner = auth.uid()
)
with check (
  bucket_id = 'avatars' and
  owner = auth.uid()
);

create policy "avatars_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars' and
  owner = auth.uid()
);
