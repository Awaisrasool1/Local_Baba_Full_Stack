package handlers

import (
	"fmt"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
	c.JSON(http.StatusOK, utils.Categories)
}

func GetCategoryNameByID(categoryID string) (string, error) {
	for _, category := range utils.Categories {
		if category.ID == categoryID {
			return category.Name, nil
		}
	}
	return "", fmt.Errorf("category not found")
}
