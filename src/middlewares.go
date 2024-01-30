package main

import (
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/golang-jwt/jwt"
	"os"
	"errors"
	"log"
	"context"
)

type Jwks struct {
  Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
  Kty string   `json:"kty"`
  Kid string   `json:"kid"`
  Use string   `json:"use"`
  N   string   `json:"n"`
  E   string   `json:"e"`
  X5c []string `json:"x5c"`
}

var ValidateToken jwtmiddleware.ValidateToken = func (ctx context.Context, token string) (interface{}, error) {
	  aud := os.Getenv("AUTH0_API_AUDIENCE")
	  checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
	  if !checkAudience {
		return token, errors.New("Invalid audience.")
	  }
	  // verify iss claim
	  iss := os.Getenv("AUTH0_DOMAIN")
	  checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
	  if !checkIss {
		return token, errors.New("Invalid issuer.")
	  }
	  
	  cert, err := getPemCert(token)
	  if err != nil {
		log.Fatalf("could not get cert: %+v", err)
	  }
	  
	  result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
	  return result, nil
}
