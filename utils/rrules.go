package utils

import (
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/teambition/rrule-go"
)

type MatrixHabit struct {
	ID           int32
	Name         string
	StartDate    time.Time
	RRule        string
	Color        string
	ExcludeDates []string
}

var dayMap = map[string]string{
	"SU": "Sunday",
	"MO": "Monday",
	"TU": "Tuesday",
	"WE": "Wednesday",
	"TH": "Thursday",
	"FR": "Friday",
	"SA": "Saturday",
}

func ParseRRule(rruleString string) (isDaily bool, days []string, startDate *time.Time) {
	if rruleString == "" {
		return false, []string{}, nil
	}

	if !strings.Contains(rruleString, "\nRRULE") {
		rruleString = strings.Replace(rruleString, "RRULE", "\nRRULE", 1)
	}

	r, err := rrule.StrToRRule(rruleString)
	if err != nil {
		return false, []string{}, nil
	}

	isDaily = r.OrigOptions.Freq == rrule.DAILY

	for _, wd := range r.OrigOptions.Byweekday {
		if longName, ok := dayMap[wd.String()]; ok {
			days = append(days, longName)
		}
	}

	if !r.OrigOptions.Dtstart.IsZero() {
		startDate = &r.OrigOptions.Dtstart
	}

	return isDaily, days, startDate
}

func GetOccurrencesWithExclusions(rruleStr string, excluded []string, targetDate time.Time) []time.Time {
	if rruleStr == "" {
		return nil
	}

	if !strings.Contains(rruleStr, "\nRRULE") {
		rruleStr = strings.Replace(rruleStr, "RRULE", "\nRRULE", 1)
	}

	r, err := rrule.StrToRRule(rruleStr)
	if err != nil {
		return nil
	}

	if r.OrigOptions.Count > 0 {
		return filterExcluded(r.All(), excluded)
	}

	start := r.OrigOptions.Dtstart
	until := r.OrigOptions.Until

	windowStart := targetDate.AddDate(0, -1, 0)
	windowEnd := targetDate.AddDate(0, 1, 0)

	if start.Before(windowStart) {
		start = windowStart
	}
	if !until.IsZero() && until.Before(windowEnd) {
		windowEnd = until
	}

	if start.After(windowEnd) {
		return nil
	}

	return filterExcluded(r.Between(start, windowEnd, true), excluded)
}

func filterExcluded(all []time.Time, excluded []string) []time.Time {
	filtered := make([]time.Time, 0, len(all))
	for _, occ := range all {
		if !ContainsDateString(excluded, occ) {
			filtered = append(filtered, occ)
		}
	}
	return filtered
}

func ContainsDateString(dates []string, target time.Time) bool {
	targetStr := target.Format("2006-01-02")
	return slices.Contains(dates, targetStr)
}
func ContainsDate(dates []time.Time, target time.Time) bool {
	targetStr := target.Format("2006-01-02")
	for _, d := range dates {
		if d.Format("2006-01-02") == targetStr {
			return true
		}
	}
	return false
}

func GenerateHabitOccurrencesByDate(habits []MatrixHabit, matrix []time.Time) map[string][]MatrixHabit {
	fmt.Println(habits, "GenerateHabitOccurrencesByDate habits")
	fmt.Println(matrix, "GenerateHabitOccurrencesByDate matrix")
	result := make(map[string][]MatrixHabit)

	start := matrix[0]
	end := matrix[len(matrix)-1]

	for _, habit := range habits {

		rruleString := habit.RRule

		if !strings.Contains(rruleString, "\nRRULE") {
			rruleString = strings.Replace(rruleString, "RRULE", "\nRRULE", 1)
		}

		r, err := rrule.StrToRRule(rruleString)

		if err != nil {
			return result
		}

		allOccurrences := r.Between(start, end, true)
		fmt.Println(allOccurrences, "GenerateHabitOccurrencesByDate allOccurrences")

		for _, occ := range allOccurrences {
			excluded := false
			for _, ex := range habit.ExcludeDates {
				if occ.Format("2006-01-02") == ex {
					excluded = true
					break
				}
			}
			if excluded {
				continue
			}

			dateStr := occ.Format("2006-01-02")
			result[dateStr] = append(result[dateStr], habit)
		}
	}

	for _, d := range matrix {
		dateStr := d.Format("2006-01-02")
		if _, exists := result[dateStr]; !exists {
			result[dateStr] = []MatrixHabit{}
		}
	}

	return result
}
