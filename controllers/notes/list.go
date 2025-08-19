package notes

import (
	"net/http"
	"strconv"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func List(c *gin.Context) {

	userId, exists := c.Get("userId")
	uid, ok := userId.(int32)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	habitIdStr := c.Query("habit_id")
	pageStr := c.Query("page")
	limitStr := c.Query("limit")
	var habitId int32
	filterByHabit := false

	if habitIdStr != "" {
		parsed, err := strconv.Atoi(habitIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid param"})
			return
		}
		habitId = int32(parsed)
		filterByHabit = true
	}

	page, limit := 1, 5
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	offset := (page - 1) * limit

	count, err := database.Queries.CountNotes(c, db.CountNotesParams{
		UserID:  pgtype.Int4{Int32: uid, Valid: uid > 0},
		HabitID: habitId,
		Column3: filterByHabit,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if count == 0 {
		c.JSON(http.StatusOK, gin.H{
			"data":       []interface{}{},
			"page":       page,
			"limit":      limit,
			"totalCount": 0,
			"totalPages": 0,
		})
		return
	}

	notes, err := database.Queries.ListNotes(c, db.ListNotesParams{
		UserID:  pgtype.Int4{Int32: uid, Valid: uid > 0},
		HabitID: habitId,
		Column3: filterByHabit,
		Limit:   int32(limit),
		Offset:  int32(offset),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (int64(count) + int64(limit) - 1) / int64(limit)

	c.JSON(http.StatusOK, gin.H{
		"data":       notes,
		"page":       page,
		"limit":      limit,
		"totalCount": count,
		"totalPages": totalPages,
	})

}
