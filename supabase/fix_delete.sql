-- Allow users to delete visits they created
create policy "Users can delete their own visits." on visits
  for delete using (auth.uid() = created_by);

-- Drop the existing foreign key constraint on ratings
alter table ratings drop constraint ratings_visit_id_fkey;

-- Re-add the foreign key comparison with ON DELETE CASCADE
-- This ensures that when a visit is deleted, all its ratings are automatically deleted
-- regardless of who owns the rating (bypassing the need for RLS on each rating delete)
alter table ratings
  add constraint ratings_visit_id_fkey
  foreign key (visit_id)
  references visits(id)
  on delete cascade;
