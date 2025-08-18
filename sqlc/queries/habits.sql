-- name: CreateHabit :one
INSERT INTO habits (name, description, categoryId, color, frequency, userId)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetHabitByID :one
SELECT * FROM habits
WHERE id = $1;

-- name: ListHabits :many
SELECT * FROM habits
WHERE userId = $1
ORDER BY id;

-- name: ListHabitsByUser :many
SELECT * FROM habits
WHERE userId = $1
ORDER BY id;

-- name: UpdateHabit :one
UPDATE habits
SET name = $2,
    description = $3,
    categoryId = $4,
    color = $5,
    frequency = $6,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteHabit :exec
DELETE FROM habits
WHERE id = $1;

-- name: SeedHabit :exec
INSERT INTO habits (id, name, description, categoryId, color, frequency, userId)
SELECT $1, $2, $3, $4, $5, $6, $7
WHERE NOT EXISTS (
    SELECT 1 FROM habits WHERE id = $1
);
