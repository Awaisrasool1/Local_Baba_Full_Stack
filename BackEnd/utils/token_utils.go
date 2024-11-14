package utils

import (
	"errors"
	"fmt"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("agfgdfdsgfdfgdertwcvb")

const EarthRadius = 6371000

func Haversine(lat1, lng1, lat2, lng2 float64) float64 {
	lat1Rad := lat1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	deltaLat := (lat2 - lat1) * math.Pi / 180
	deltaLng := (lng2 - lng1) * math.Pi / 180

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(deltaLng/2)*math.Sin(deltaLng/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return EarthRadius * c
}

func ValidateToken(tokenString string) (*jwt.MapClaims, error) {
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return &claims, nil
}

func RoleAuthorization(allowedRoles ...int) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.Request.Header.Get("Authorization")
		claims, err := ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
			c.Abort()
			return
		}

		role, ok := (*claims)["role"].(float64)
		fmt.Println(role)
		fmt.Println(allowedRoles)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid role data"})
			c.Abort()
			return
		}

		for _, r := range allowedRoles {
			if int(role) == r {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"status": "error", "message": "You do not have access to this resource"})
		c.Abort()
	}
}
