-- ====================================================================
-- PARCL INTEL — REAL ESTATE BUYERS DATASET (SAMPLE DATA)
-- Run this SQL in your Supabase SQL Editor to populate public.buyers table
-- ====================================================================

INSERT INTO public.buyers (
    client_type, gender, country, region, acquisition_purpose, loan_applied, referral_channel, satisfaction_score, predicted_cluster_id, predicted_cluster_name
) VALUES
-- C1: Global Investors
('Individual', 'Male', 'UAE', 'Dubai', 'Investment', false, 'Direct', 8.7, 'C1', 'Global Investor'),
('Individual', 'Female', 'United States', 'New York', 'Investment', false, 'Agent', 8.5, 'C1', 'Global Investor'),
('Individual', 'Male', 'United Kingdom', 'London', 'Investment', false, 'Direct', 8.6, 'C1', 'Global Investor'),
('Individual', 'Male', 'Singapore', 'Central Region', 'Investment', false, 'Online Portal', 8.4, 'C1', 'Global Investor'),
('Individual', 'Female', 'Germany', 'Frankfurt', 'Investment', false, 'Agent', 8.3, 'C1', 'Global Investor'),
('Individual', 'Male', 'Canada', 'Toronto', 'Investment', false, 'Direct', 8.5, 'C1', 'Global Investor'),
('Individual', 'Female', 'Japan', 'Tokyo', 'Investment', false, 'Agent', 8.6, 'C1', 'Global Investor'),
('Individual', 'Male', 'Australia', 'Sydney', 'Investment', false, 'Online Portal', 8.2, 'C1', 'Global Investor'),

-- C2: First-Time Buyers
('Individual', 'Female', 'United States', 'Florida', 'Personal Use', true, 'Online Portal', 7.8, 'C2', 'First-Time Buyer'),
('Individual', 'Male', 'United Kingdom', 'Manchester', 'Personal Use', true, 'Agent', 7.5, 'C2', 'First-Time Buyer'),
('Individual', 'Female', 'United States', 'Texas', 'Personal Use', true, 'Online Portal', 8.1, 'C2', 'First-Time Buyer'),
('Individual', 'Male', 'Germany', 'Berlin', 'Personal Use', true, 'Direct', 7.6, 'C2', 'First-Time Buyer'),
('Individual', 'Female', 'Canada', 'Vancouver', 'Personal Use', true, 'Agent', 7.9, 'C2', 'First-Time Buyer'),
('Individual', 'Male', 'Australia', 'Melbourne', 'Personal Use', true, 'Online Portal', 7.4, 'C2', 'First-Time Buyer'),
('Individual', 'Female', 'United States', 'California', 'Personal Use', true, 'Agent', 8.0, 'C2', 'First-Time Buyer'),

-- C3: Corporate Buyers
('Corporate', 'Other', 'UAE', 'Abu Dhabi', 'Investment', false, 'Corporate', 9.1, 'C3', 'Corporate Buyer'),
('Corporate', 'Other', 'United States', 'New York', 'Investment', false, 'Corporate', 9.3, 'C3', 'Corporate Buyer'),
('Corporate', 'Other', 'United Kingdom', 'London', 'Investment', false, 'Corporate', 9.0, 'C3', 'Corporate Buyer'),
('Corporate', 'Other', 'Singapore', 'Sentosa', 'Investment', false, 'Direct', 9.2, 'C3', 'Corporate Buyer'),
('Corporate', 'Other', 'Germany', 'Munich', 'Investment', false, 'Corporate', 8.9, 'C3', 'Corporate Buyer'),
('Corporate', 'Other', 'Japan', 'Tokyo', 'Investment', false, 'Corporate', 9.4, 'C3', 'Corporate Buyer'),

-- C4: Luxury Investors
('Individual', 'Male', 'UAE', 'Dubai', 'Investment', false, 'Direct', 9.6, 'C4', 'Luxury Investor'),
('Individual', 'Female', 'United States', 'California', 'Investment', false, 'Agent', 9.5, 'C4', 'Luxury Investor'),
('Individual', 'Male', 'United Kingdom', 'London', 'Investment', false, 'Direct', 9.7, 'C4', 'Luxury Investor'),
('Individual', 'Female', 'Singapore', 'Sentosa', 'Investment', false, 'Agent', 9.4, 'C4', 'Luxury Investor'),
('Individual', 'Male', 'United States', 'Florida', 'Investment', false, 'Direct', 9.8, 'C4', 'Luxury Investor'),
('Individual', 'Female', 'UAE', 'Abu Dhabi', 'Investment', false, 'Agent', 9.3, 'C4', 'Luxury Investor'),
('Individual', 'Male', 'France', 'Paris', 'Investment', false, 'Direct', 9.5, 'C4', 'Luxury Investor'),
('Individual', 'Male', 'Switzerland', 'Zurich', 'Investment', false, 'Agent', 9.9, 'C4', 'Luxury Investor');

-- Verify insertion
SELECT count(*) AS total_sample_buyers, predicted_cluster_id, predicted_cluster_name 
FROM public.buyers 
GROUP BY predicted_cluster_id, predicted_cluster_name
ORDER BY predicted_cluster_id;
