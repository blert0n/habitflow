ALTER TABLE notes
ALTER COLUMN content TYPE TEXT
USING content::text;
