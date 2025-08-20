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

-- name: CreateNote :one
INSERT INTO notes (habit_id, user_id, title, content, created_at, updated_at)
VALUES ($1, $2, $3, $4, NOW(), NOW())
RETURNING *;

