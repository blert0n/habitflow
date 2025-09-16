package habits

import (
	"net/http"
	"strconv"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

type HabitResponse struct {
	ID            int32    `json:"id"`
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	CreatedAt     string   `json:"createdat"`
	UpdatedAt     string   `json:"updatedat"`
	CategoryID    int32    `json:"categoryid"`
	Color         string   `json:"color"`
	Frequency     string   `json:"frequency"`
	UserID        int32    `json:"userid"`
	IsDaily       bool     `json:"isDaily"`
	SelectedDays  []string `json:"selectedDays"`
	ExcludedDates []string `json:"excludedDates"`
	IsCompleted   bool     `json:"isCompleted"`
}

type CompletionInfo struct {
	Completed bool   `json:"completed"`
	Time      string `json:"time"`
}

func List(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Not authenticated"})
		return
	}

	uid := userID.(int32)

	habits, err := database.Queries.ListHabits(c, pgtype.Int4{Int32: uid, Valid: true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var resp []HabitResponse
	resp = make([]HabitResponse, 0)
	for _, h := range habits {
		isDaily, selectedDays, _ := utils.ParseRRule(utils.TextToString(h.Frequency))

		excludedDates := utils.NormalizeExcludedDates(h.ExcludedDates)

		resp = append(resp, HabitResponse{
			ID:            h.ID,
			Name:          h.Name,
			Description:   utils.TextToString(h.Description),
			CreatedAt:     h.Createdat.Time.Format(time.RFC3339),
			UpdatedAt:     h.Updatedat.Time.Format(time.RFC3339),
			CategoryID:    utils.Int4ToInt32(h.Categoryid),
			Color:         utils.TextToString(h.Color),
			Frequency:     utils.TextToString(h.Frequency),
			UserID:        utils.Int4ToInt32(h.Userid),
			IsDaily:       isDaily,
			SelectedDays:  selectedDays,
			ExcludedDates: excludedDates,
		})
	}

	c.JSON(http.StatusOK, resp)
}

func ListOne(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Not authenticated"})
		return
	}

	parsedUserId := userID.(int32)

	Id := c.Query("id")

	parsedId, err := strconv.Atoi(Id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Bad param"})
		return
	}

	habit, err := database.Queries.GetHabitByID(c, db.GetHabitByIDParams{
		ID:     int32(parsedId),
		Userid: pgtype.Int4{Int32: parsedUserId, Valid: true},
	})

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, habit)
}

func ListHabitsByDate(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Not authenticated"})
		return
	}
	uid := userID.(int32)

	dateStr := c.Query("date")
	targetDate := time.Now().UTC()
	if dateStr != "" {
		if t, err := time.Parse("2006-01-02", dateStr); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
			return
		} else {
			targetDate = t
		}
	}

	todaysHabits, err := GetHabitsForDate(c, uid, targetDate)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	pageStr := c.Query("page")
	limitStr := c.Query("limit")
	page, limit := 1, 5

	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	start := (page - 1) * limit
	end := start + limit
	if start > len(todaysHabits) {
		start = len(todaysHabits)
	}
	if end > len(todaysHabits) {
		end = len(todaysHabits)
	}

	paginated := todaysHabits[start:end]

	c.JSON(http.StatusOK, gin.H{
		"data":       paginated,
		"page":       page,
		"limit":      limit,
		"totalCount": len(todaysHabits),
		"totalPages": (len(todaysHabits) + limit - 1) / limit,
	})
}

func ListHabitsByRange(c *gin.Context) {

	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	uid := userId.(int32)

	startParam := c.Query("startDate")
	endParam := c.Query("endDate")

	if startParam == "" || endParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing params"})
		return
	}

	start, err := time.Parse("2006-01-02", startParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid param"})
		return
	}

	end, err := time.Parse("2006-01-02", endParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid param"})
		return
	}

	dbHabits, err := database.Queries.ListHabits(c, pgtype.Int4{Int32: uid, Valid: uid > 0})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch habits"})
		return
	}

	habits := make([]utils.MatrixHabit, 0, len(dbHabits))
	for _, h := range dbHabits {
		excludedDates := utils.NormalizeExcludedDates(h.ExcludedDates)

		_, _, startDate := utils.ParseRRule(utils.TextToString(h.Frequency))

		habits = append(habits, utils.MatrixHabit{
			ID:           h.ID,
			Name:         h.Name,
			StartDate:    *startDate,
			RRule:        h.Frequency.String,
			ExcludeDates: excludedDates,
			Color:        h.Color.String,
		})
	}

	matrix := []time.Time{}

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		matrix = append(matrix, d)
	}

	occurrences := utils.GenerateHabitOccurrencesByDate(habits, matrix)

	response := make(map[string][]HabitResponse)
	for date, hs := range occurrences {
		for _, h := range hs {
			response[date] = append(response[date], HabitResponse{
				ID:    h.ID,
				Name:  h.Name,
				Color: h.Color,
			})
		}
	}

	c.JSON(http.StatusOK, response)
}

func Options(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Not authenticated"})
		return
	}

	uid := userID.(int32)

	habits, err := database.Queries.HabitOptions(c, pgtype.Int4{Int32: uid, Valid: true})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, habits)
}

func GetHabitsForDate(c *gin.Context, userID int32, targetDate time.Time) ([]HabitResponse, error) {
	habits, err := database.Queries.ListHabits(c, pgtype.Int4{Int32: userID, Valid: true})
	if err != nil {
		return nil, err
	}

	todaysHabits := []HabitResponse{}
	dateStr := targetDate.Format("2006-01-02")

	for _, h := range habits {
		log, _ := database.Queries.IsCompleted(c, db.IsCompletedParams{
			HabitID: h.ID,
			UserID:  userID,
			Date:    dateStr,
		})

		excluded := utils.NormalizeExcludedDates(h.ExcludedDates)

		occurrences := utils.GetOccurrencesWithExclusions(utils.TextToString(h.Frequency), excluded, targetDate)

		if !utils.ContainsDate(occurrences, targetDate) {
			continue
		}

		isDaily, selectedDays, _ := utils.ParseRRule(utils.TextToString(h.Frequency))

		todaysHabits = append(todaysHabits, HabitResponse{
			ID:            h.ID,
			Name:          h.Name,
			Description:   utils.TextToString(h.Description),
			CreatedAt:     h.Createdat.Time.Format(time.RFC3339),
			UpdatedAt:     h.Updatedat.Time.Format(time.RFC3339),
			CategoryID:    utils.Int4ToInt32(h.Categoryid),
			Color:         utils.TextToString(h.Color),
			Frequency:     utils.TextToString(h.Frequency),
			UserID:        utils.Int4ToInt32(h.Userid),
			IsDaily:       isDaily,
			SelectedDays:  selectedDays,
			ExcludedDates: excluded,
			IsCompleted:   log,
		})
	}

	return todaysHabits, nil
}
