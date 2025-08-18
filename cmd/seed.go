package cmd

import (
	"context"

	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/jackc/pgx/v5/pgtype"
)

func Seed(q *db.Queries) error {
	ctx := context.Background()

	user, err := q.SeedUser(ctx, db.SeedUserParams{
		Username: "demo",
		Email:    "demo@habitflow.com",
		Password: "$2a$12$a7QLYwjEjIy8R2LQkdwAau8RNWzUn.fEGJgV9Zgg9AjPWnPkKrqI2",
	})

	if err != nil {
		return err
	}

	categorySeeds := []struct {
		ID   int32
		Name string
	}{
		{1, "Fitness"}, {2, "Learning"}, {3, "Mental Health"}, {4, "Health"},
		{5, "Sleep"}, {6, "Productivity"}, {7, "Spirituality"}, {8, "Personal Care"},
		{9, "Relationships"}, {10, "Creativity"}, {11, "Work"}, {12, "Adventure"},
	}

	for _, c := range categorySeeds {
		if err := q.SeedCategories(ctx, db.SeedCategoriesParams{
			ID:   c.ID,
			Name: c.Name,
		}); err != nil {
			return err
		}
	}

	mockHabits := []struct {
		ID          int32
		Name        string
		CategoryID  int32
		Description string
		Frequency   string
		Color       string
	}{
		{1, "Morning Exercise", 1, "Do a quick workout to wake up and get energized.", "DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR", "#FF5733"},
		{2, "Read 30 mins", 2, "Read a book or article for at least 30 minutes.", "DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU,TH,SA", "#33A1FF"},
		{3, "Meditation", 3, "Spend some quiet time meditating or breathing deeply.", "DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU,MO,WE,FR", "#8E44AD"},
		{4, "Drink Water", 4, "Make sure to drink enough water throughout the day.", "DTSTART:20250817T050000Z\nRRULE:FREQ=DAILY", "#1ABC9C"},
		{5, "Sleep 8 hours", 4, "Pick up a book and read for half an hour.", "DTSTART:20250817T050000Z\nRRULE:FREQ=DAILY", "#F39C12"},
		{6, "Journal Writing", 3, "Write down your thoughts, plans, or feelings daily.", "DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU,TU,TH,SA", "#E74C3C"},
	}

	for _, h := range mockHabits {
		if err := q.SeedHabit(ctx, db.SeedHabitParams{
			ID:          h.ID,
			Name:        h.Name,
			Description: pgtype.Text{String: h.Description, Valid: true},
			Categoryid:  pgtype.Int4{Int32: h.CategoryID, Valid: true},
			Color:       pgtype.Text{String: h.Color, Valid: true},
			Frequency:   pgtype.Text{String: h.Frequency, Valid: true},
			Userid:      pgtype.Int4{Int32: user.ID, Valid: true},
		}); err != nil {
			return err
		}
	}

	return nil
}
