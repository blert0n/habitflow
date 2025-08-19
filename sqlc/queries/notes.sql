-- name: ListNotes :many
SELECT *
FROM notes
WHERE user_id = $1
  AND ($3::bool IS FALSE OR habit_id = $2)
ORDER BY created_at DESC
LIMIT $4
OFFSET $5;

-- name: CountNotes :one
SELECT COUNT(*)
FROM notes
WHERE user_id = $1
  AND ($3::bool IS FALSE OR habit_id = $2);
