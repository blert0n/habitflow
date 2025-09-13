-- name: ListNotes :many
SELECT n.*,h.name as habit_name
FROM notes n
INNER JOIN habits h ON n.habit_id = h.id
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

-- name: EditNote :one
UPDATE notes
SET title = $1,
    content = $2,
    habit_id = $3,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $4
  AND user_id = $5
RETURNING *;

-- name: DeleteNote :exec
DELETE FROM notes where id = $1 AND user_id = $2;


