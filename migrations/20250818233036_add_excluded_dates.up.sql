CREATE TABLE IF NOT EXISTS habit_excluded_dates (
    id SERIAL PRIMARY KEY,
    habit_id INT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    excluded_date DATE NOT NULL
);
