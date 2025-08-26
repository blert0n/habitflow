package notes

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func Edit(c *gin.Context) {
	userId, exists := c.Get("userId")
	uid, ok := userId.(int32)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		ID      int32  `json:"id"`
		Title   string `json:"title"`
		HabitId int32  `json:"habit_id"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note, err := database.Queries.EditNote(c, db.EditNoteParams{
		ID:      body.ID,
		Title:   body.Title,
		Content: body.Content,
		HabitID: body.HabitId,
		UserID:  pgtype.Int4{Int32: uid, Valid: uid > 0},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":      note.ID,
			"habitId": note.HabitID,
			"userId":  note.UserID.Int32,
			"title":   note.Title,
			"content": note.Content,
		},
	})

}
