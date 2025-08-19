package habits

import (
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
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
		isDaily, selectedDays := utils.ParseRRule(utils.TextToString(h.Frequency))

		excluded := []string{}

		if h.ExcludedDates != nil {
			switch v := h.ExcludedDates.(type) {
			case []time.Time:
				for _, d := range v {
					excluded = append(excluded, d.Format("2006-01-02"))
				}
			case []interface{}:
				for _, d := range v {
					if t, ok := d.(time.Time); ok {
						excluded = append(excluded, t.Format("2006-01-02"))
					}
				}
			}
		}

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
			ExcludedDates: excluded,
		})
	}

	c.JSON(http.StatusOK, resp)
}
