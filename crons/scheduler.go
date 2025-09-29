package crons

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/robfig/cron/v3"
)

func generateRandomTime() string {
	// Random hour between 6 (6 AM) and 23 (11 PM)
	hour := rand.Intn(18) + 6 // 6 to 23

	// Random minute between 0 and 59
	minute := rand.Intn(60)

	// Random second between 0 and 59
	second := rand.Intn(60)

	return fmt.Sprintf("%02d:%02d:%02d", hour, minute, second)
}

const DAILY = "0 0 * * *"
const EVERY_MINUTE = "* * * * *"

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

	demoUserHabits, err := database.Queries.ListHabits(ctx, pgtype.Int4{Int32: demoUser.ID, Valid: true})

	if err != nil {
		log.Println("Cron daily job - demo user has no habits")
		return
	}

	var todayHabitIDs []int32

	for _, habit := range demoUserHabits {
		habitExludedDates := utils.NormalizeExcludedDates(habit.ExcludedDates)
		isScheduled := utils.IsHabitScheduledForDate(habit.Frequency.String, habitExludedDates, today)
		if isScheduled {
			todayHabitIDs = append(todayHabitIDs, habit.ID)
		}
	}

	completedCount := 0

	for _, habitID := range todayHabitIDs {
		if rand.Intn(2) == 0 {
			err := database.Queries.MarkAsCompletedDemo(ctx, db.MarkAsCompletedDemoParams{
				HabitID: habitID,
				UserID:  demoUser.ID,
				Date:    todayStr,
				Time:    generateRandomTime(),
			})

			if err != nil {
				log.Printf("❌ Failed to create completion log for habit ID %d: %v", habitID, err)
			} else {
				log.Printf("✅ Created completion log for habit ID %d", habitID)
				completedCount++
			}
		} else {
			log.Printf("⏭️ Skipped habit ID %d", habitID)
		}
	}

}
