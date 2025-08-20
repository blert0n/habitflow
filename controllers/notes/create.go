package notes

import (
	"encoding/json"
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func Create(c *gin.Context) {
	userId, exists := c.Get("userId")
	uid, ok := userId.(int32)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	var body struct {
		HabitID int32       `json:"habit_id"`
		Title   string      `json:"title,omitempty"`
		Content interface{} `json:"content,omitempty"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contentJSON, err := json.Marshal(body.Content)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid content"})
		return
	}

	note, err := database.Queries.CreateNote(c, db.CreateNoteParams{
		HabitID: body.HabitID,
		UserID:  pgtype.Int4{Int32: uid, Valid: true},
		Title:   body.Title,
		Content: contentJSON,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var decodedContent interface{}
	if err := json.Unmarshal(note.Content, &decodedContent); err != nil {
		decodedContent = nil
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":      note.ID,
			"habitId": note.HabitID,
			"userId":  note.UserID.Int32,
			"title":   note.Title,
			"content": decodedContent,
		},
	})
}
