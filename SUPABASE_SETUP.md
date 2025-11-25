# Supabase Database Setup for StoryVerse

## 1. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: `storyverse` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes ~2 minutes)

## 2. Get Your API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

3. Add them to your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
-- Create stories table
CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  ip_id TEXT UNIQUE NOT NULL,
  token_id TEXT NOT NULL,
  nft_contract TEXT NOT NULL,
  ipfs_hash TEXT NOT NULL,
  token_uri TEXT NOT NULL,
  
  -- Story content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  
  -- Author info
  author TEXT NOT NULL,
  creator_name TEXT,
  
  -- Media
  image_ipfs_hash TEXT,
  
  -- License terms
  minting_fee TEXT NOT NULL DEFAULT '0',
  commercial_rev_share NUMERIC NOT NULL DEFAULT 0,
  license_terms_id TEXT NOT NULL DEFAULT '1',
  
  -- Blockchain references
  tx_hash TEXT,
  parent_ip_id TEXT,
  remix_of TEXT,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'fully_registered',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_stories_author ON stories(author);
CREATE INDEX idx_stories_ip_id ON stories(ip_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_parent_ip_id ON stories(parent_ip_id) WHERE parent_ip_id IS NOT NULL;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stories
CREATE POLICY "Stories are publicly readable"
  ON stories FOR SELECT
  USING (true);

-- Allow anyone to insert stories (they need wallet to create on blockchain anyway)
CREATE POLICY "Anyone can insert stories"
  ON stories FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update (upsert) stories
CREATE POLICY "Anyone can update stories"
  ON stories FOR UPDATE
  USING (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 4. Test the Connection

1. Restart your dev server: `npm run dev`
2. Create a new story in your app
3. Check Supabase dashboard → **Table Editor** → **stories**
4. You should see your story appear!

## 5. Optional: Enable Real-time Updates

If you want stories to appear instantly when others create them:

1. In Supabase dashboard, go to **Database** → **Replication**
2. Enable replication for the `stories` table
3. In your code, you can subscribe to changes:

```typescript
// In useFetchStoriesFromDb.ts
supabase
  .channel('stories')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stories' }, payload => {
    // Automatically refetch or add new story to the list
    queryClient.invalidateQueries(['stories']);
  })
  .subscribe();
```

## Troubleshooting

**"Missing Supabase environment variables"**:
- Make sure `.env` file has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding them

**"relation 'stories' does not exist"**:
- Run the SQL creation script in Supabase SQL Editor
- Make sure you're in the correct project

**Stories not appearing**:
- Check browser console for errors
- Verify credentials in `.env` are correct
- Check Supabase Table Editor to see if data is actually being saved

## What's Next?

Your app now uses:
- ✅ **Blockchain** for immutability and IP registration
- ✅ **Supabase** for fast, efficient querying
- ✅ **IPFS** for decentralized content storage

The correct IP IDs from Story Protocol will now appear because they're saved directly from the blockchain registration response!
