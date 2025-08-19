ALTER TABLE notes
DROP CONSTRAINT IF EXISTS fk_habit_completion;

DROP INDEX IF EXISTS idx_notes_completion_id;

ALTER TABLE notes
RENAME COLUMN habit_completion_id TO habit_id;

ALTER TABLE notes
ADD CONSTRAINT fk_notes_habit
FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_notes_habit_id
ON notes(habit_id);
