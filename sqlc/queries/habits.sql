-- name: CreateHabit :one
INSERT INTO habits (
    name,
    description,
    categoryId,
    color,
    frequency,
    userId,
    createdAt,
    updatedAt
) VALUES (
    $1, $2, $3, $4, $5, $6, NOW(), NOW()
)
RETURNING *;

-- name: GetHabitByID :one
SELECT h.id,
       h.name,
       h.description,
       h.createdAt,
       h.updatedAt,
       h.categoryId,
       h.color,
       h.frequency,
       h.userId,
       COALESCE(array_agg(he.excluded_date ORDER BY he.excluded_date) FILTER (WHERE he.excluded_date IS NOT NULL), '{}') AS excluded_dates
FROM habits h
LEFT JOIN habit_excluded_dates he ON he.habit_id = h.id
WHERE h.id = $1 AND h.userId = $2 
GROUP BY h.id
ORDER BY h.id;

-- name: ListHabits :many
SELECT h.id,
       h.name,
       h.description,
       h.createdAt,
       h.updatedAt,
       h.categoryId,
       h.color,
       h.frequency,
       h.userId,
       COALESCE(array_agg(he.excluded_date ORDER BY he.excluded_date) FILTER (WHERE he.excluded_date IS NOT NULL), '{}') AS excluded_dates
FROM habits h
LEFT JOIN habit_excluded_dates he ON he.habit_id = h.id
WHERE h.userId = $1
GROUP BY h.id
ORDER BY h.id;


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
WHERE id = $1 AND userId= $7
RETURNING *;

-- name: DeleteHabit :exec
DELETE FROM habits
WHERE id = $1 AND userId = $2;

-- name: SeedHabit :exec
INSERT INTO habits (id, name, description, categoryId, color, frequency, userId)
SELECT $1, $2, $3, $4, $5, $6, $7
WHERE NOT EXISTS (
    SELECT 1 FROM habits WHERE id = $1
);

-- name: CreateHabitExcludedDate :exec
INSERT INTO habit_excluded_dates (
    habit_id,
    excluded_date
) VALUES (
    $1, $2
);

-- name: ListHabitExcludedDates :many
SELECT excluded_date FROM habit_excluded_dates
WHERE habit_id = $1;

-- name: DeleteHabitExcludedDate :exec
DELETE FROM habit_excluded_dates
WHERE habit_id = $1
  AND excluded_date = $2;

-- name: HabitOptions :many
SELECT habits.id,habits.name FROM habits
WHERE userId = $1;

