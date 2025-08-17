-- name: CreateUser :one
INSERT INTO users (first_name,last_name, username, email, password)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
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

