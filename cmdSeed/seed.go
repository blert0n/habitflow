package main

import (
	"context"
	"fmt"
	"log"
	"os"

	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"github.com/blert0n/habitflow/cmd"
)

func main() {
	if os.Getenv("GO_ENV") != "production" {
		_ = godotenv.Load()
	}
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://" + os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASSWORD") +
			"@" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") +
			"/" + os.Getenv("DB_NAME") + "?sslmode=disable"
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}
	defer pool.Close()

	queries := db.New(pool)

	if err := cmd.Seed(queries); err != nil {
		log.Fatal("seeding failed:", err)
	}

	fmt.Println("✅ Database seeded successfully")
}
