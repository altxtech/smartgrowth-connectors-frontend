package main

import (
	"net/http"

	"github.com/altxtech/smartgrowth-connectors-frontend/api"
	"github.com/altxtech/smartgrowth-connectors-frontend/middleware"

	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading the .env file: %v", err)
	}

	router := gin.Default()
	
	// API route
	router.GET("/api/connectors", middleware.EnsureValidToken(), api.ListConnectors)

	// Frontend
	router.GET("/", func (c *gin.Context) {
		c.Redirect(http.StatusSeeOther, "/app")
	})
	router.Static("/app", "./frontend")

	log.Print("Server listening on http://localhost:8080")
	router.Run()
}
