package main

import (
	"fmt"
	"net/url"
	"os"

	"github.com/IqbalMind/jurnal-api-example/golang/jurnal"
)

func main() {
	// Retrieve credentials from environment or replace with your credentials
	clientID := os.Getenv("JURNAL_CLIENT_ID")
	if clientID == "" {
		clientID = "your-client-id"
	}

	clientSecret := os.Getenv("JURNAL_CLIENT_SECRET")
	if clientSecret == "" {
		clientSecret = "your-client-secret"
	}

	env := jurnal.Sandbox
	if os.Getenv("JURNAL_ENV") == "production" {
		env = jurnal.Production
	}

	client := jurnal.NewClient(clientID, clientSecret, env)
	fmt.Printf("Initialized Go Mekari Jurnal client [Environment: %s]\n\n", env)

	// Example 1: GET a single sales invoice
	invoiceID := "2963983"
	path := fmt.Sprintf("/public/jurnal/api/v1/sales_invoices/%s", invoiceID)
	fmt.Printf("1. Sending GET request to: %s\n", path)

	resp, body, err := client.Get(path, nil)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Status Code: %d\n", resp.StatusCode)
	fmt.Printf("Response Body: %s\n\n", string(body))

	// Example 2: GET with query parameters
	queryParams := url.Values{}
	queryParams.Set("page", "1")
	queryParams.Set("page_size", "10")

	fmt.Println("2. Sending GET request with query params...")
	respList, bodyList, errList := client.Get("/public/jurnal/api/v1/sales_invoices", queryParams)
	if errList != nil {
		fmt.Printf("Error: %v\n", errList)
		return
	}
	fmt.Printf("Status Code: %d\n", respList.StatusCode)
	fmt.Printf("Response preview: %s\n", string(bodyList))
}
