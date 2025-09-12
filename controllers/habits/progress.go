package habits

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ProgressResponse struct {
	TodayCompleted      int     `json:"today_completed"`
	TodayTotal          int     `json:"today_total"`
	WeeklyCompletionAvg float64 `json:"weekly_completion_rate"`
	WeekCompletions     int     `json:"week_completions"`
	TotalPossible       int     `json:"total_possible"`
}

func CalculateTodayProgress(c *gin.Context, userID int32, targetDate time.Time) (int, int, error) {
	todaysHabits, err := GetHabitsForDate(c, userID, targetDate)
	if err != nil {
		return 0, 0, err
	}

	completedCount := 0
	for _, h := range todaysHabits {
		if h.IsCompleted {
			completedCount++
		}
	}

	totalHabits := len(todaysHabits)
	if totalHabits == 0 {
		return 0, 0, nil
	}

	return completedCount, totalHabits, nil
}

func CalculateWeeklyCompletion(c *gin.Context, userID int32, targetDate time.Time) (int, int, float64, error) {
	weekStart := targetDate
	for weekStart.Weekday() != time.Monday {
		weekStart = weekStart.AddDate(0, 0, -1)
	}

	weekCompletions := 0
	totalPossibleCompletions := 0

	for i := 0; i < daysPassedThisWeek(targetDate); i++ {
		date := weekStart.AddDate(0, 0, i)

		habitsForDay, err := GetHabitsForDate(c, userID, date)
		if err != nil {
			continue
		}

		for _, h := range habitsForDay {
			if h.IsCompleted {
				weekCompletions++
			}
		}

		totalPossibleCompletions += len(habitsForDay)
	}

	weeklyAvg := 0.0
	if totalPossibleCompletions > 0 {
		weeklyAvg = float64(weekCompletions) / float64(totalPossibleCompletions)
	}

	return weekCompletions, totalPossibleCompletions, weeklyAvg, nil
}

func GetProgress(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Not authorized"})
		return
	}

	uid := userID.(int32)

	targetDate := time.Now().UTC()
	if dateStr := c.Query("date"); dateStr != "" {
		if parsedDate, err := time.Parse("2006-01-02", dateStr); err == nil {
			targetDate = parsedDate
		}
	}

	todayCompleted, todayTotal, err := CalculateTodayProgress(c, uid, targetDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	weekCompletions, totalPossible, weeklyAvg, err := CalculateWeeklyCompletion(c, uid, targetDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ProgressResponse{
		TodayCompleted:      todayCompleted,
		TodayTotal:          todayTotal,
		WeeklyCompletionAvg: weeklyAvg,
		WeekCompletions:     weekCompletions,
		TotalPossible:       totalPossible,
	})
}

func GetWeeklyProgress(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Not authorized"})
		return
	}

	uid := userID.(int32)

	dateStr := c.Query("date")
	if dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date parameter is required"})
		return
	}

	targetDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	weekCompletions, totalPossible, weeklyAvg, err := CalculateWeeklyCompletion(c, uid, targetDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	weekStart := targetDate
	for weekStart.Weekday() != time.Monday {
		weekStart = weekStart.AddDate(0, 0, -1)
	}
	weekEnd := weekStart.AddDate(0, 0, 6)

	c.JSON(http.StatusOK, gin.H{
		"date":                  targetDate.Format("2006-01-02"),
		"week_start":            weekStart.Format("2006-01-02"),
		"week_end":              weekEnd.Format("2006-01-02"),
		"completions":           weekCompletions,
		"possible_completions":  totalPossible,
		"completion_rate":       weeklyAvg,
		"completion_percentage": fmt.Sprintf("%.1f%%", weeklyAvg*100),
	})
}

func daysPassedThisWeek(date time.Time) int {
	weekday := int(date.Weekday())

	if weekday == 0 {
		weekday = 6
	} else {
		weekday = weekday - 1
	}

	return weekday + 1
}
