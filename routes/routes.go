package routes

import (
	"net/http"

	"github.com/blert0n/habitflow/controllers/auth"
	"github.com/blert0n/habitflow/controllers/habits"
	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/middleware"
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

	rg.GET("/habits", middleware.IsAuthenticated(), habits.List)
	rg.POST("/habits", middleware.IsAuthenticated(), habits.Create)
	rg.DELETE("/habits", middleware.IsAuthenticated(), habits.Delete)
	rg.POST("/auth/sign-in", auth.SignIn)
	rg.POST("/auth/sign-up", auth.SignUp)
	rg.GET("/auth/sign-out", auth.SignOut)
	rg.GET("/auth/me", auth.Me)
	rg.GET("/auth/google/login", auth.GoogleLogin)
	rg.GET("/auth/google/callback", auth.GoogleCallback)

}
