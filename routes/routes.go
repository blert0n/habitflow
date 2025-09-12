package routes

import (
	"github.com/blert0n/habitflow/controllers/auth"
	"github.com/blert0n/habitflow/controllers/habits"
	"github.com/blert0n/habitflow/controllers/logs"
	"github.com/blert0n/habitflow/controllers/notes"
	"github.com/blert0n/habitflow/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/habits/list", middleware.IsAuthenticated(), habits.List)
	rg.GET("/habits/options", middleware.IsAuthenticated(), habits.Options)
	rg.GET("/habits/by-date", middleware.IsAuthenticated(), habits.ListHabitsByDate)
	rg.GET("/habits/matrix", middleware.IsAuthenticated(), habits.ListHabitsByRange)
	rg.POST("/habits/create", middleware.IsAuthenticated(), habits.Create)
	rg.POST("/habits/edit", middleware.IsAuthenticated(), habits.Edit)
	rg.POST("/logs/check", middleware.IsAuthenticated(), logs.MarkAsComplete)
	rg.POST("/logs/uncheck", middleware.IsAuthenticated(), logs.MarkAsIncomplete)
	rg.DELETE("/habits/delete", middleware.IsAuthenticated(), habits.Delete)
	rg.GET("/notes/list", middleware.IsAuthenticated(), notes.List)
	rg.POST("/notes/create", middleware.IsAuthenticated(), notes.Create)
	rg.POST("/notes/edit", middleware.IsAuthenticated(), notes.Edit)
	rg.POST("/notes/delete", middleware.IsAuthenticated(), notes.Delete)
	rg.POST("/auth/sign-in", auth.SignIn)
	rg.POST("/auth/sign-up", auth.SignUp)
	rg.GET("/auth/sign-out", auth.SignOut)
	rg.GET("/auth/me", auth.Me)
	rg.GET("/auth/demo", auth.Demo)
	rg.GET("/auth/google/login", auth.GoogleLogin)
	rg.GET("/auth/google/callback", auth.GoogleCallback)

}
