package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func init() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	if err = client.Ping(ctx, nil); err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to MongoDB!")
}

func GetCollection(collectionName string) *mongo.Collection {
	return client.Database("foodApp").Collection(collectionName)
}
