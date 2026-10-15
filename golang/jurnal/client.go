package jurnal

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// Environment represents the target Mekari Jurnal API environment.
type Environment string

const (
	Sandbox    Environment = "sandbox"
	Production Environment = "production"
)

// Client handles authenticated requests to Mekari Jurnal Open API.
type Client struct {
	Username    string
	Secret      string
	Environment Environment
	BaseURL     string
	HTTPClient  *http.Client
}

// NewClient initializes a new Mekari Jurnal API client.
func NewClient(username, secret string, env Environment) *Client {
	baseURL := "https://sandbox-api.mekari.com"
	if env == Production {
		baseURL = "https://api.mekari.com"
	}

	return &Client{
		Username:    username,
		Secret:      secret,
		Environment: env,
		BaseURL:     baseURL,
		HTTPClient:  &http.Client{Timeout: 30 * time.Second},
	}
}

// SignatureData holds the generated signature and metadata.
type SignatureData struct {
	Date          string
	RequestLine   string
	Authorization string
}

// GenerateSignature produces the HMAC-SHA256 signature and headers.
func (c *Client) GenerateSignature(method, path string) SignatureData {
	// Format time in RFC 7231 / HTTP-date GMT format (e.g., "Thu, 15 Oct 2026 04:09:20 GMT")
	dateString := time.Now().UTC().Format(http.TimeFormat)
	requestLine := fmt.Sprintf("%s %s HTTP/1.1", strings.ToUpper(method), path)
	dataToSign := fmt.Sprintf("date: %s\n%s", dateString, requestLine)

	mac := hmac.New(sha256.New, []byte(c.Secret))
	mac.Write([]byte(dataToSign))
	signature := base64.StdEncoding.EncodeToString(mac.Sum(nil))

	authHeader := fmt.Sprintf(
		`hmac username="%s", algorithm="hmac-sha256", headers="date request-line", signature="%s"`,
		c.Username, signature,
	)

	return SignatureData{
		Date:          dateString,
		RequestLine:   requestLine,
		Authorization: authHeader,
	}
}

// Request executes an authenticated HTTP request.
func (c *Client) Request(method, path string, body []byte, queryParams url.Values) (*http.Response, []byte, error) {
	upperMethod := strings.ToUpper(method)

	fullPath := path
	if len(queryParams) > 0 {
		if strings.Contains(fullPath, "?") {
			fullPath = fmt.Sprintf("%s&%s", fullPath, queryParams.Encode())
		} else {
			fullPath = fmt.Sprintf("%s?%s", fullPath, queryParams.Encode())
		}
	}

	sig := c.GenerateSignature(upperMethod, fullPath)
	targetURL := fmt.Sprintf("%s%s", c.BaseURL, fullPath)

	var reqBody io.Reader
	if len(body) > 0 && upperMethod != http.MethodGet && upperMethod != http.MethodDelete {
		reqBody = bytes.NewReader(body)
	}

	req, err := http.NewRequest(upperMethod, targetURL, reqBody)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", sig.Authorization)
	req.Header.Set("Date", sig.Date)
	req.Header.Set("Accept", "application/json")

	if len(body) > 0 && upperMethod != http.MethodGet && upperMethod != http.MethodDelete {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return resp, nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return resp, respBody, nil
}

// Get performs an authenticated GET request.
func (c *Client) Get(path string, queryParams url.Values) (*http.Response, []byte, error) {
	return c.Request(http.MethodGet, path, nil, queryParams)
}

// Post performs an authenticated POST request.
func (c *Client) Post(path string, body []byte) (*http.Response, []byte, error) {
	return c.Request(http.MethodPost, path, body, nil)
}

// Put performs an authenticated PUT request.
func (c *Client) Put(path string, body []byte) (*http.Response, []byte, error) {
	return c.Request(http.MethodPut, path, body, nil)
}

// Delete performs an authenticated DELETE request.
func (c *Client) Delete(path string) (*http.Response, []byte, error) {
	return c.Request(http.MethodDelete, path, nil, nil)
}
