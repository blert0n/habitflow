package routes

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/categories", func(ctx *gin.Context) {

		categories, err := database.Queries.ListCategories(ctx)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, categories)
	})
}
