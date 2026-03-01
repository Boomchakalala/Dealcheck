-- DealCheck V1 Initial Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  usage_count INTEGER DEFAULT 0 CHECK (usage_count >= 0)
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor TEXT,
  title TEXT NOT NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('New', 'Renewal')),
  goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rounds table
CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT,
  extracted_text TEXT,
  output_json JSONB NOT NULL,
  output_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('done', 'error')),
  error_message TEXT,
  model_version TEXT DEFAULT 'gpt-4o'
);

-- Indexes for better query performance
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_rounds_deal_id ON rounds(deal_id);
CREATE INDEX idx_rounds_user_id ON rounds(user_id);
CREATE INDEX idx_rounds_created_at ON rounds(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Deals policies
CREATE POLICY "Users can read own deals"
  ON deals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals"
  ON deals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals"
  ON deals FOR DELETE
  USING (auth.uid() = user_id);

-- Rounds policies
CREATE POLICY "Users can read own rounds"
  ON rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rounds"
  ON rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rounds"
  ON rounds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rounds"
  ON rounds FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on deals
CREATE TRIGGER on_deal_updated
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
