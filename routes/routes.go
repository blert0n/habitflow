package routes

import (
	"net/http"

	"github.com/blert0n/habitflow/controllers/auth"
	"github.com/blert0n/habitflow/controllers/habits"
	"github.com/blert0n/habitflow/controllers/logs"
	"github.com/blert0n/habitflow/controllers/notes"
	"github.com/blert0n/habitflow/controllers/profile"
	"github.com/blert0n/habitflow/controllers/upload"
	"github.com/blert0n/habitflow/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/habits/list", middleware.IsAuthenticated(), habits.List)
	rg.GET("/habits/one", middleware.IsAuthenticated(), habits.ListOne)
	rg.GET("/habits/one/monthly-logs", middleware.IsAuthenticated(), habits.GetHabitMonthlyLogs)
	rg.GET("/habits/one/streak", middleware.IsAuthenticated(), habits.GetHabitStreak)
	rg.GET("/habits/stats", middleware.IsAuthenticated(), habits.GetAllHabitStatsAPI)
	rg.GET("/habits/options", middleware.IsAuthenticated(), habits.Options)
	rg.GET("/habits/by-date", middleware.IsAuthenticated(), habits.ListHabitsByDate)
	rg.GET("/habits/matrix", middleware.IsAuthenticated(), habits.ListHabitsByRange)
	rg.GET("/habits/progress", middleware.IsAuthenticated(), habits.GetProgress)
	rg.GET("/habits/progress/week", middleware.IsAuthenticated(), habits.GetWeeklyProgress)
	rg.POST("/habits/create", middleware.IsAuthenticated(), habits.Create)
	rg.POST("/habits/edit", middleware.IsAuthenticated(), habits.Edit)
	rg.POST("/logs/check", middleware.IsAuthenticated(), logs.MarkAsComplete)
	rg.POST("/logs/uncheck", middleware.IsAuthenticated(), logs.MarkAsIncomplete)
	rg.DELETE("/habits/delete", middleware.IsAuthenticated(), habits.Delete)
	rg.GET("/notes/list", middleware.IsAuthenticated(), notes.List)
	rg.POST("/notes/create", middleware.IsAuthenticated(), notes.Create)
	rg.POST("/notes/edit", middleware.IsAuthenticated(), notes.Edit)
	rg.POST("/notes/delete", middleware.IsAuthenticated(), notes.Delete)
	rg.POST("/upload/avatar", middleware.IsAuthenticated(), upload.UploadAvatar)
	rg.POST("/profile/update", middleware.IsAuthenticated(), middleware.IsDemoUser(), profile.UpdateProfile)
	rg.POST("/profile/change-password", middleware.IsAuthenticated(), middleware.IsDemoUser(), profile.ChangePassword)
	rg.POST("/profile/delete-account", middleware.IsAuthenticated(), middleware.IsDemoUser(), profile.DeleteAccount)
	rg.POST("/auth/sign-in", auth.SignIn)
	rg.POST("/auth/sign-up", auth.SignUp)
	rg.GET("/auth/sign-out", auth.SignOut)
	rg.GET("/auth/me", auth.Me)
	rg.GET("/auth/demo", auth.Demo)
	rg.GET("/auth/google/login", auth.GoogleLogin)
	rg.GET("/auth/google/callback", auth.GoogleCallback)
	rg.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"ping": "pong"})
	})

}
