package main

import (
	"math/rand/v2"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// album represents data about a record album.
type form struct {
	ID        int    `json:"id"`
	Recipient string `json:"recipient"`
	Message   string `json:"message"`
	Date      string `json:"date"`
}

type formInput struct {
	Recipient string `json:"recipient"`
	Message   string `json:"message"`
	Date      string `json:"date"`
}

var forms = []form{
	{ID: 1, Recipient: "Foo", Message: "Bruh", Date: "2006-01-02T15:04:05Z07:00"},
}

func main() {
	router := gin.Default()
	router.Use(cors.Default()) // All origins allowed by default
	router.GET("/forms", getForms)
	router.GET("/forms/:id", getFormsByID)
	router.POST("/forms", postForms)

	router.Run("localhost:8080")

}

// getForms responds with the list of all forms as JSON.
func getForms(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, forms)
}

func postForms(c *gin.Context) {
	var newForm formInput

	// var newId = rand.IntN(100_000_000)

	if err := c.BindJSON(&newForm); err != nil {
		return
	}

	created := form{
		ID:        rand.IntN(100_000_000),
		Recipient: newForm.Recipient,
		Message:   newForm.Message,
		Date:      newForm.Date,
	}

	forms = append(forms, created)

	c.IndentedJSON(http.StatusCreated, newForm)
}

func getFormsByID(c*gin.Context){
	targetId := c.Param("id")
	intId, err := strconv.Atoi(targetId)
	
	if err != nil {
		// Handle error case - the string wasn't a valid integer
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid ID format"})
		return
	}
	
	for _, a := range forms{
		if a.ID == intId{
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message":"data not found"})
}
