-- name: CreateUser :one
INSERT INTO users (first_name,last_name, username, email, password)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT id,username,first_name,last_name,email,password,createdat FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: UpdateUser :one
UPDATE users
SET username = $2,
    email = $3,
    password = $4,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: SeedUser :one
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
ON CONFLICT (username) DO UPDATE
SET username = EXCLUDED.username
RETURNING *;

-- name: UpdateUserProfile :exec
UPDATE users
SET first_name = $2,
    last_name = $3,
    email = $4,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UpdateUserPassword :exec
UPDATE users
SET password = $2,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: DeleteUserCompletions :exec
DELETE FROM habit_completions_log
WHERE user_id = $1;

-- name: DeleteUserHabits :exec
DELETE FROM habits
WHERE userid = $1;

-- name: DeleteUserNotes :exec
DELETE FROM notes
WHERE user_id = $1;

-- name: DeleteUserHabitStats :exec
DELETE FROM habit_stats
WHERE user_id = $1;
