package notes

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func Delete(c *gin.Context) {
	userId, exists := c.Get("userId")
	uid, ok := userId.(int32)

	if !exists || !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		Id int32 `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid params"})
		return
	}

	err := database.Queries.DeleteNote(c, db.DeleteNoteParams{
		ID:     body.Id,
		UserID: pgtype.Int4{Int32: uid, Valid: uid > 0},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
