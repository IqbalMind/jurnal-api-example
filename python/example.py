import os
import json
from jurnal_api import JurnalApi

# Replace with your actual Mekari Client ID and Client Secret
# Or set environment variables JURNAL_CLIENT_ID and JURNAL_CLIENT_SECRET
HMAC_USERNAME = os.getenv("JURNAL_CLIENT_ID", "your-client-id")
HMAC_SECRET = os.getenv("JURNAL_CLIENT_SECRET", "your-client-secret")
ENVIRONMENT = os.getenv("JURNAL_ENV", "sandbox")  # "sandbox" or "production"

def main():
    # Initialize the client
    client = JurnalApi(
        username=HMAC_USERNAME,
        secret=HMAC_SECRET,
        environment=ENVIRONMENT
    )

    # Example 1: GET Sales Invoice by ID
    invoice_id = "2963983"
    path = f"/public/jurnal/api/v1/sales_invoices/{invoice_id}"

    print(f"Sending GET request to {ENVIRONMENT} environment...")
    print(f"Path: {path}")

    response = client.get(path)

    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print("Response JSON:")
        print(json.dumps(data, indent=2))
    except Exception:
        print("Raw Response:", response.text)

    # Example 2: GET with Query Parameters (e.g. List Sales Invoices with pagination)
    # response_list = client.get("/public/jurnal/api/v1/sales_invoices", params={"page": 1, "page_size": 10})
    # print("List Status:", response_list.status_code)

if __name__ == "__main__":
    main()
