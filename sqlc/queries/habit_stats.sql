-- name: UpsertHabitStats :one
INSERT INTO habit_stats (user_id, habit_id, max_streak, total_completions)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, habit_id)
DO UPDATE SET
    max_streak = GREATEST(habit_stats.max_streak, EXCLUDED.max_streak),
    total_completions = EXCLUDED.total_completions,
    updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- name: GetHabitStats :one
SELECT * FROM habit_stats
WHERE user_id = $1 AND habit_id = $2;

-- name: IncrementTotalCompletions :one
UPDATE habit_stats
SET total_completions = total_completions + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND habit_id = $2
RETURNING *;

-- name: DecrementTotalCompletions :one
UPDATE habit_stats
SET total_completions = GREATEST(0, total_completions - 1),
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND habit_id = $2
RETURNING *;

-- name: UpdateMaxStreak :one
UPDATE habit_stats
SET max_streak = GREATEST(max_streak, $3),
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND habit_id = $2
RETURNING *;

-- name: GetAllUserHabitStats :many
SELECT * FROM habit_stats
WHERE user_id = $1
ORDER BY habit_id;
