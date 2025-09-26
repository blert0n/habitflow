package utils

import (
	"time"

	db "github.com/blert0n/habitflow/sqlc/generated"
)

func NormalizeExcludedDates(input interface{}) []string {
	excludedDates := []string{}

	if input == nil {
		return excludedDates
	}

	switch v := input.(type) {
	case []time.Time:
		for _, d := range v {
			excludedDates = append(excludedDates, d.Format("2006-01-02"))
		}
	case []interface{}:
		for _, d := range v {
			if t, ok := d.(time.Time); ok {
				excludedDates = append(excludedDates, t.Format("2006-01-02"))
			}
		}
	}

	return excludedDates
}

func CalculateStreak(occurrences []time.Time, completions []db.GetAllHabitCompletionsRow, targetDate time.Time) int {
	completed := make(map[string]bool)
	for _, c := range completions {
		completed[c.Date] = true
	}

	today := time.Now().Format("2006-01-02")
	streak := 0

	for i := len(occurrences) - 1; i >= 0; i-- {
		occ := occurrences[i]
		if occ.After(targetDate) {
			continue
		}
		key := occ.Format("2006-01-02")
		if completed[key] {
			streak++
		} else {
			if key == today {
				continue
			}
			break
		}
	}
	return streak
}
