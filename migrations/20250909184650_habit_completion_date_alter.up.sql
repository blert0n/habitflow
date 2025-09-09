ALTER TABLE habit_completions_log
    DROP COLUMN completed_at,
    ADD COLUMN date VARCHAR(10) NOT NULL,
    ADD COLUMN time VARCHAR(8) NOT NULL;
