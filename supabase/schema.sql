-- Create a table for public profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  email text,

  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up
-- This is a common pattern in Supabase
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Restoration Visits
create table visits (
  id uuid default gen_random_uuid() primary key,
  restaurant_name text not null,
  visit_date date not null,
  created_by uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table visits enable row level security;

create policy "Visits are viewable by everyone." on visits
  for select using (true);

create policy "Authenticated users can create visits." on visits
  for insert with check (auth.role() = 'authenticated');

-- Ratings
create table ratings (
  id uuid default gen_random_uuid() primary key,
  visit_id uuid references visits(id) not null,
  user_id uuid references profiles(id) not null,
  food_rating int check (food_rating >= 1 and food_rating <= 10),
  drink_rating int check (drink_rating >= 1 and drink_rating <= 10),
  service_rating int check (service_rating >= 1 and service_rating <= 10),
  atmosphere_rating int check (atmosphere_rating >= 1 and atmosphere_rating <= 10),
  value_rating int check (value_rating >= 1 and value_rating <= 10),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(visit_id, user_id) -- One rating per user per visit
);

alter table ratings enable row level security;

create policy "Ratings are viewable by everyone." on ratings
  for select using (true);

create policy "Users can create their own ratings." on ratings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own ratings." on ratings
  for update using (auth.uid() = user_id);

-- Settings (Singleton or per-group later, keeping simple for now)
create table settings (
  id uuid default gen_random_uuid() primary key,
  food_weight float default 1.0,
  drink_weight float default 1.0,
  service_weight float default 1.0,
  atmosphere_weight float default 1.0,
  value_weight float default 1.0
);

alter table settings enable row level security;

create policy "Settings are viewable by everyone." on settings
  for select using (true);

-- Insert default settings
insert into settings (food_weight, drink_weight, service_weight, atmosphere_weight, value_weight)
values (1.0, 1.0, 1.0, 1.0, 1.0);
