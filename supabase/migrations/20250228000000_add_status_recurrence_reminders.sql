-- Appointment status (confirmed, cancelled, completed)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'confirmed';
UPDATE appointments SET status = 'confirmed' WHERE status IS NULL;

-- Recurring appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS recurrence_rule VARCHAR(50);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES appointments(id);

-- Email reminder tracking
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_1h_sent BOOLEAN DEFAULT FALSE;
