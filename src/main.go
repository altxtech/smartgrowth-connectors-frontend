package main
import (
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/golang-jwt/jwt"
	"strconv"
	"fmt"
	"errors"
	"os"
	"encoding/json"
)

type Connector struct {
	ID int64 `json:"id"`
	DisplayName string `json:"display_name"`
	AuthUrl string `json:"auth_url"` 
}

type APIErrorResponse struct {
	Error string `json:"error"`
}

func NewAPIErrorResponse(message string) APIErrorResponse {
	return APIErrorResponse{ message }
}

type CreateConnectorRequest struct {
	DisplayName string `json:"display_name"`
	AuthURL string `json:"auth_url"`
}
 
// Dummy database for testing
var connectors []Connector = []Connector{
	{1,  "Tik Tok for Business", "https://business-api.tiktok.com/portal/auth?app_id=7329683572879523841&state=your_custom_params&redirect_uri=http%3A%2F%2Flocalhost%3A8080"},
}

// API Handlers
func ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message":"pong"})
	return
}

func APIError(c *gin.Context, status int, message string) {
	c.Header("Content-Type", "application/json")
	c.JSON(status, NewAPIErrorResponse(message))
}


func ListConnectors(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, connectors)
	return
}

func GetConnector(c *gin.Context) {

	connectorID, err := strconv.ParseInt(c.Param("connectorID"), 10, 32)
	if err != nil {
		APIError(c, http.StatusBadRequest, "Invalid Connector ID")
		return
	}

	// Search for GetConnector
	for _, conn := range connectors {
		if conn.ID == connectorID{
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusOK, conn)
			return 
		}
	}
	
	// If not found...
	APIError(c, http.StatusNotFound, fmt.Sprintf("Connector with ID %d not found.", connectorID))
	return
}

func CreateConnector(c *gin.Context) {
	
	// Auto increment, get max id
	ID := int64(len(connectors) + 1)

	var request CreateConnectorRequest

	err := c.ShouldBindJSON(&request)
	if err != nil {
		APIError(c, http.StatusBadRequest, "Invalid request body.")
		return
	}

	newConnector := Connector{ID, request.DisplayName, request.AuthURL}
	connectors = append(connectors, newConnector)

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, newConnector)
	return
}


var jwtMiddleWare *jwtmiddleware.JWTMiddleware

func main() {

	// JWT MiddleWare setup

	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./views", true)))

	// Serve API
	api := router.Group("/api")
	{
		api.GET("/ping", ping)
		
		// Connectors
		api.GET("/connectors", ListConnectors)
		api.GET("/connectors/:connectorID", GetConnector)
		api.POST("/connectors", CreateConnector)
	}

	// Start server
	router.Run()
}


func getPemCert(token *jwt.Token) (string, error) {
  cert := ""
  resp, err := http.Get(os.Getenv("AUTH0_DOMAIN") + ".well-known/jwks.json")
  if err != nil {
    return cert, err
  }
  defer resp.Body.Close()
    
  var jwks = Jwks{}
  err = json.NewDecoder(resp.Body).Decode(&jwks)
    
  if err != nil {
    return cert, err
  }
    
  x5c := jwks.Keys[0].X5c
  for k, v := range x5c {
    if token.Header["kid"] == jwks.Keys[k].Kid {
      cert = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
    }
  }
    
  if cert == "" {
    return cert, errors.New("unable to find appropriate key.")
  }
    
  return cert, nil
}
