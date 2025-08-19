CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    habit_completion_id INT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_habit_completion FOREIGN KEY (habit_completion_id)
        REFERENCES habit_completions_log(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notes_completion_id 
    ON notes(habit_completion_id);

CREATE INDEX IF NOT EXISTS idx_notes_created_at 
    ON notes(created_at);

CREATE INDEX IF NOT EXISTS idx_notes_updated_at 
    ON notes(updated_at);
