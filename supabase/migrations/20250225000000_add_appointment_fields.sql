-- Add optional fields to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'Other';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS location TEXT;
