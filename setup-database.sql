-- StoryVerse Database Schema
-- Run this in Supabase SQL Editor

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
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
CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author);
CREATE INDEX IF NOT EXISTS idx_stories_ip_id ON stories(ip_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_parent_ip_id ON stories(parent_ip_id) WHERE parent_ip_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Stories are publicly readable" ON stories;
DROP POLICY IF EXISTS "Anyone can insert stories" ON stories;
DROP POLICY IF EXISTS "Anyone can update stories" ON stories;

-- Allow anyone to read stories
CREATE POLICY "Stories are publicly readable"
  ON stories FOR SELECT
  USING (true);

-- Allow anyone to insert stories
CREATE POLICY "Anyone can insert stories"
  ON stories FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update stories
CREATE POLICY "Anyone can update stories"
  ON stories FOR UPDATE
  USING (true);

-- Create or replace function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table creation
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as story_count FROM stories;
