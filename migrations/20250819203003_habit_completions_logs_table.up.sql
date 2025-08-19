CREATE TABLE IF NOT EXISTS habit_completions_log (
    id SERIAL PRIMARY KEY,
    habit_id INT NOT NULL,
    user_id INT NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions_log (habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions_log (user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at ON habit_completions_log (completed_at);
