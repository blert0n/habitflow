-- name: MarkHabitAsCompleted :one
INSERT INTO habit_completions_log (
    habit_id,
    user_id,
    date,
    time
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: MarkAsIncomplete :exec
DELETE FROM habit_completions_log
WHERE habit_id = $1
  AND user_id = $2
  AND date = $3;

-- name: IsCompleted :one
SELECT EXISTS (
    SELECT 1
    FROM habit_completions_log
    WHERE habit_id = $1
      AND user_id = $2
      AND date = $3
) AS is_completed;

-- name: GetCompletionsInRange :many
SELECT date, TRUE as completed, time as timeAtCompletion
FROM habit_completions_log
WHERE habit_id = $1
  AND user_id = $2
  AND date BETWEEN $3 AND $4
ORDER By id desc;

-- name: GetAllHabitCompletions :many
SELECT date, TRUE as completed, time as timeAtCompletion
FROM habit_completions_log
WHERE habit_id = $1
  AND user_id = $2
  ORDER BY date DESC;

-- name: MarkAsCompletedDemo :exec
INSERT INTO habit_completions_log (
    habit_id,
    user_id,
    date,
    time
)
SELECT $1, $2, $3, $4
WHERE NOT EXISTS (
    SELECT 1
    FROM habit_completions_log
    WHERE habit_id = $1
      AND user_id = $2
      AND date = $3
);


