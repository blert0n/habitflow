package crons

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/blert0n/habitflow/ai"
	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/robfig/cron/v3"
)

func generateRandomTime() string {
	hour := rand.Intn(18) + 6 // 6–23
	minute := rand.Intn(60)
	second := rand.Intn(60)
	return fmt.Sprintf("%02d:%02d:%02d", hour, minute, second)
}

const DAILY = "0 0 * * *"

func InitCronJobs() *cron.Cron {
	c := cron.New()

	_, err := c.AddFunc("0 0 * * *", dailyJob)
	if err != nil {
		log.Fatalf("Failed to add daily cron job: %v", err)
	}

	c.Start()
	log.Println("Cron scheduler started - jobs scheduled successfully")
	return c
}

func dailyJob() {
	log.Println("Running daily cron job at midnight")

	ctx := context.Background()

	demoUser, err := database.Queries.GetUserByEmail(ctx, "demo@habitflow.com")
	if err != nil {
		log.Println("Cron daily job - could not find demo user")
		return
	}

	today := time.Now()
	todayStr := today.Format("2006-01-02")
	log.Printf("Checking habits scheduled for: %s", todayStr)

	demoHabits, err := database.Queries.ListHabits(ctx, pgtype.Int4{Int32: demoUser.ID, Valid: true})
	if err != nil || len(demoHabits) == 0 {
		log.Println("Cron daily job - demo user has no habits")
		return
	}

	completedCount := 0
	for _, habit := range demoHabits {
		if !isScheduledToday(habit, today) {
			continue
		}

		if rand.Intn(2) == 0 {
			if markHabitCompleted(ctx, demoUser.ID, habit.ID, todayStr) {
				if createHabitNote(ctx, demoUser.ID, habit.ID, habit.Name) {
					completedCount++
				}
			}
		} else {
			log.Printf("⏭️ Skipped habit ID %d", habit.ID)
		}
	}

	log.Printf("✅ Daily cron job finished, completed %d habits", completedCount)
}

func isScheduledToday(habit db.ListHabitsRow, today time.Time) bool {
	excluded := utils.NormalizeExcludedDates(habit.ExcludedDates)
	return utils.IsHabitScheduledForDate(habit.Frequency.String, excluded, today)
}

func markHabitCompleted(ctx context.Context, userID, habitID int32, date string) bool {
	_, err := database.Queries.MarkHabitAsCompleted(ctx, db.MarkHabitAsCompletedParams{
		HabitID: habitID,
		UserID:  userID,
		Date:    date,
		Time:    generateRandomTime(),
	})
	if err != nil {
		log.Printf("❌ Failed to create completion log for habit ID %d: %v", habitID, err)
		return false
	}

	log.Printf("✅ Created completion log for habit ID %d", habitID)
	return true
}

func createHabitNote(ctx context.Context, userID, habitID int32, habitName string) bool {
	noteContent, err := ai.GenerateHabitNote(habitName)
	if err != nil {
		log.Printf("❌ Failed to generate note for habit ID %d: %v", habitID, err)
		return false
	}

	formatted := fmt.Sprintf(`<p dir="ltr"><span style="white-space: pre-wrap;">%s</span></p>`, noteContent)
	_, err = database.Queries.CreateNote(ctx, db.CreateNoteParams{
		HabitID: habitID,
		UserID:  pgtype.Int4{Int32: userID, Valid: true},
		Title:   habitName,
		Content: formatted,
	})
	if err != nil {
		log.Printf("❌ Failed to create note for habit ID %d: %v", habitID, err)
		return false
	}

	return true
}
