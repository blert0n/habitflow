package habits

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
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

func GetHabitMonthlyLogs(c *gin.Context) {

	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	uid := userId.(int32)
	date := c.Query("date")
	habitId := c.Query("habitId")

	targetDate := time.Now().UTC()

	if date != "" {
		if t, err := time.Parse("2006-01-02", date); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
			return
		} else {
			targetDate = t
		}
	}
	parsedHabitId, err := strconv.Atoi(habitId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Bad params"})
		return
	}

	habit, err := database.Queries.GetHabitByID(c, db.GetHabitByIDParams{
		ID:     int32(parsedHabitId),
		Userid: pgtype.Int4{Int32: uid, Valid: true},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch habits"})
		return
	}

	excludedDates := utils.NormalizeExcludedDates(habit.ExcludedDates)

	allMonth := utils.GetOccurrencesForMonth(
		utils.TextToString(habit.Frequency),
		excludedDates,
		targetDate,
	)

	response := make(map[string]CompletionInfo, len(allMonth))

	if len(allMonth) == 0 {
		c.JSON(http.StatusOK, response)
		return
	}

	firstDate := allMonth[0].Format("2006-01-02")
	lastDate := allMonth[len(allMonth)-1].Format("2006-01-02")

	completionLogs, _ := database.Queries.GetCompletionsInRange(c, db.GetCompletionsInRangeParams{
		UserID:  uid,
		HabitID: int32(parsedHabitId),
		Date:    firstDate,
		Date_2:  lastDate,
	})

	logLookup := make(map[string]CompletionInfo, len(completionLogs))
	for _, log := range completionLogs {
		logLookup[log.Date] = CompletionInfo{
			Completed: log.Completed,
			Time:      log.Timeatcompletion,
		}
	}

	for _, date := range allMonth {
		formattedDate := date.Format("2006-01-02")
		if info, exists := logLookup[formattedDate]; exists {
			response[formattedDate] = info
		} else {
			response[formattedDate] = CompletionInfo{
				Completed: false,
				Time:      "",
			}
		}
	}

	c.JSON(http.StatusOK, response)
}

func GetHabitStreak(c *gin.Context) {
	userID, exists := c.Get("userId")
	parsedUserId, ok := userID.(int32)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Not authorized"})
		return
	}

	habitId := c.Query("id")
	parsedHabitId, errorParsing := strconv.Atoi(habitId)

	if errorParsing != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid params"})
		return
	}

	habit, err := database.Queries.GetHabitByID(c, db.GetHabitByIDParams{
		ID:     int32(parsedHabitId),
		Userid: pgtype.Int4{Int32: parsedUserId, Valid: true},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	completionLogs, err := database.Queries.GetAllHabitCompletions(c, db.GetAllHabitCompletionsParams{
		HabitID: int32(parsedHabitId),
		UserID:  parsedUserId,
	})

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"Streak": 0})
		return
	}

	excludedDates := utils.NormalizeExcludedDates(habit.ExcludedDates)

	targetDate := time.Now().UTC().Add(time.Hour*23 + time.Minute*59 + time.Second*59)
	if dateStr := c.Query("date"); dateStr != "" {
		if parsedDate, err := time.Parse("2006-01-02", dateStr); err == nil {
			targetDate = parsedDate.Add(time.Hour*23 + time.Minute*59 + time.Second*59)
		}
	}

	occurrences := utils.GetOccurrencesUntilToday(utils.TextToString(habit.Frequency), excludedDates, targetDate)

	streak := utils.CalculateStreak(occurrences, completionLogs, targetDate)
	biggestStreak := utils.CalculateBiggestStreak(occurrences, completionLogs)

	completionAvgRate := 0.0
	if len(occurrences) > 0 {
		completionAvgRate = float64(len(completionLogs)) / float64(len(occurrences))
	}

	habitStats, statsErr := database.Queries.GetHabitStats(c, db.GetHabitStatsParams{
		UserID:  parsedUserId,
		HabitID: int32(parsedHabitId),
	})

	maxStreak := biggestStreak
	totalCompletions := len(completionLogs)
	if statsErr == nil {
		if habitStats.MaxStreak.Valid {
			maxStreak = int(habitStats.MaxStreak.Int32)
		}
		if habitStats.TotalCompletions.Valid {
			totalCompletions = int(habitStats.TotalCompletions.Int32)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"streak":                streak,
		"biggest_streak":        maxStreak,
		"total_completions":     totalCompletions,
		"total_day_since_start": len(occurrences),
		"completion_avg_rate":   completionAvgRate,
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

func GetAllHabitStatsAPI(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	uid := userID.(int32)

	allStats, err := database.Queries.GetAllUserHabitStats(c, uid)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch habit stats"})
		return
	}

	statsList := make([]gin.H, 0, len(allStats))
	for _, stat := range allStats {
		statsList = append(statsList, gin.H{
			"habit_id":          stat.HabitID,
			"max_streak":        stat.MaxStreak.Int32,
			"total_completions": stat.TotalCompletions.Int32,
			"created_at":        stat.CreatedAt,
			"updated_at":        stat.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"stats": statsList,
	})
}
