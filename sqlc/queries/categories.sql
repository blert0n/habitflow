-- name: CreateCategory :one
INSERT INTO category (name)
VALUES ($1)
RETURNING *;

-- name: GetCategoryByID :one
SELECT * FROM category
WHERE id = $1;

-- name: ListCategories :many
SELECT * FROM category
ORDER BY id;

-- name: UpdateCategory :one
UPDATE category
SET name = $2
WHERE id = $1
RETURNING *;

-- name: DeleteCategory :exec
DELETE FROM category
WHERE id = $1;


-- name: SeedCategories :exec
INSERT INTO category (id,name)
SELECT $1, $2
WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE id = $1
);
