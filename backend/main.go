package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// album represents data about a record album.
type form struct {
	ID        string `json:"id"`
	Recipient string `json:"recipient"`
	Message   string `json:"message"`
}

var forms = []form{
	{ID: "1", Recipient: "Foo", Message: "Bruh"},
	{ID: "2", Recipient: "Foo2", Message: "Bruh2"},
}

func main() {
	router := gin.Default()
	router.GET("/forms", getForms)

	router.Run("localhost:8080")
}

// getForms responds with the list of all forms as JSON.
func getForms(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, forms)
}
