package router

import (
	"encoding/gob"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/altxtech/smartgrowth-connectors-frontend/platform/authenticator"
	"github.com/altxtech/smartgrowth-connectors-frontend/web/app/callback"
	"github.com/altxtech/smartgrowth-connectors-frontend/web/app/login"
	"github.com/altxtech/smartgrowth-connectors-frontend/web/app/logout"
)

// New registers the routes and returns the router.
func New(auth *authenticator.Authenticator) *gin.Engine {
	router := gin.Default()

	// Register custom types for cookies
	gob.Register(map[string]interface{}{})

	store := cookie.NewStore()
	router.Use(sessions.Sessions("auth-session", store))
	
	router.GET("/login", login.Handler(auth))
	router.GET("/callback", callback.Handler(auth))
	router.GET("/logout", logout.Handler)

	// Serve API
	// TODO

	// Serve frontend
	router.GET("/", func (c *gin.Context) {
		c.Redirect(http.StatusSeeOther, "/app")
	})
	router.Static("/app", "./web/frontend")

	return router
}
