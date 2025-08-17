-- name: CreateUser :one
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY id;

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

-- name: SeedUser :exec
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
ON CONFLICT (username) DO NOTHING;
