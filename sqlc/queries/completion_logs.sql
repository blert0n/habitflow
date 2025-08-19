-- name: MarkHabitAsCompleted :one
INSERT INTO habit_completions_log (
    habit_id,
    user_id
) VALUES (
    $1, $2
)
RETURNING *;

-- name: MarkAsIncomplete :exec
DELETE FROM habit_completions_log
WHERE habit_id = $1
  AND user_id = $2
  AND DATE(completed_at) = $3;

-- name: IsCompleted :one
SELECT EXISTS (
    SELECT 1
    FROM habit_completions_log
    WHERE habit_id = $1
      AND user_id = $2
      AND DATE(completed_at) = $3
) AS is_completed;


