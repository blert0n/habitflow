package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/blert0n/habitflow/cmd"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	DB      *pgxpool.Pool
	Queries *db.Queries
)

func InitDB() error {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://" + os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASSWORD") +
			"@" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") +
			"/" + os.Getenv("DB_NAME") + "?sslmode=disable"
	}

	var pool *pgxpool.Pool
	var err error

	for i := 0; i < 5; i++ {
		pool, err = pgxpool.New(context.Background(), dsn)
		if err == nil {
			break
		}
		fmt.Printf("Attempt %d: failed to connect to database: %v\n", i+1, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("failed to connect to database after retries: %w", err)
	}

	DB = pool
	Queries = db.New(DB)

	if os.Getenv("GO_ENV") != "production" {
		if err := cmd.RunMigrations(dsn, "./migrations"); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}
		if err := cmd.Seed(Queries); err != nil {
			log.Fatalf("failed to run seed: %v", err)
		}
	}

	return nil
}
