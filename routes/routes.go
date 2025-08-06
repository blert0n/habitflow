package routes

import (
	"github.com/blert0n/habitflow/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/users", controllers.GetUsers)
}
