package user

import (
	"context"
	"fmt"
	"foodApp/database"
	"foodApp/envConfig"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func Upload_Image(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var user models.User

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	userID := (*claim)["userId"].(string)
	collection := database.GetCollection("user")
	ctx := context.Background()

	err = collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "meesage": "user not found"})
		return
	}

	s3Region, accessKeyID, s3Bucket, secretKey, _, _, _ := envConfig.GetEnvVars()
	file, header, err := c.Request.FormFile("image")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(s3Region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKeyID,
			secretKey,
			"",
		)),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to configure AWS"})
		return
	}

	s3Client := s3.NewFromConfig(cfg)

	filename := time.Now().Format("20060102150405") + "-" + header.Filename

	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(s3Bucket),
		Key:    aws.String(filename),
		Body:   file,
	})
	log.Println(err)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3"})
		return
	}

	publicURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s",
		s3Bucket,
		s3Region,
		filename,
	)

	_, err = collection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{
		"$set": bson.M{
			"image": publicURL,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image in database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "image upload successfuly"})
}
