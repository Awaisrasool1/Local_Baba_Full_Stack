// envConfig/envConfig.go
package envConfig

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads the environment variables from the .env file
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}

// GetEnvVars retrieves the environment variables
func GetEnvVars() (string, string, string, string) {
	return os.Getenv("S3_REGION"), os.Getenv("ACCESS_KEY_ID"), os.Getenv("S3_BUCKET"), os.Getenv("SECRET_KEY")
}
