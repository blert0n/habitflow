package habits

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func Delete(c *gin.Context) {
	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		Id int32 `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid, ok := userId.(int32)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Not authorized"})
		return
	}

	err := database.Queries.DeleteHabit(c, db.DeleteHabitParams{
		ID:     body.Id,
		Userid: pgtype.Int4{Int32: uid, Valid: uid > 0},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
