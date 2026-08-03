-- ====================================================================
-- PARCL INTEL — SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ====================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'Admin & Lead ML Engineer',
    tier TEXT DEFAULT 'FREE',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Buyers Dataset Table (Raw & Processed Real Estate Buyer Records)
CREATE TABLE IF NOT EXISTS public.buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_type TEXT DEFAULT 'Individual',
    gender TEXT DEFAULT 'Other',
    country TEXT DEFAULT 'United States',
    region TEXT DEFAULT 'New York',
    acquisition_purpose TEXT DEFAULT 'Investment',
    loan_applied BOOLEAN DEFAULT false,
    referral_channel TEXT DEFAULT 'Direct',
    satisfaction_score NUMERIC(3,1) DEFAULT 8.0,
    predicted_cluster_id TEXT DEFAULT 'C1',
    predicted_cluster_name TEXT DEFAULT 'Global Investor',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Buyer Predictions Table (Stores User ML classification history)
CREATE TABLE IF NOT EXISTS public.buyer_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    cluster_id TEXT NOT NULL,
    cluster_name TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_predictions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. RLS Policies for Buyers (Authenticated Users can read & insert buyer records)
CREATE POLICY "Authenticated users can view buyers"
    ON public.buyers FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert buyers"
    ON public.buyers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. RLS Policies for Buyer Predictions
CREATE POLICY "Users can view their own buyer predictions"
    ON public.buyer_predictions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyer predictions"
    ON public.buyer_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Trigger Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        'Admin & Lead ML Engineer',
        'FREE'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Attach Trigger to Auth.Users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- Schema setup complete!
-- ====================================================================
