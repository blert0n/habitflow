ALTER TABLE notes ALTER COLUMN content TYPE jsonb USING content::jsonb;
