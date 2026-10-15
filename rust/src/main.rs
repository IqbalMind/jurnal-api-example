use jurnal_api_rust::JurnalClient;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client_id = env::var("JURNAL_CLIENT_ID").unwrap_or_else(|_| "your-client-id".to_string());
    let client_secret = env::var("JURNAL_CLIENT_SECRET").unwrap_or_else(|_| "your-client-secret".to_string());
    let env_mode = env::var("JURNAL_ENV").unwrap_or_else(|_| "sandbox".to_string());

    println!("Initializing Rust Mekari Jurnal client [{}]...", env_mode);
    let client = JurnalClient::new(client_id, client_secret, &env_mode);

    let path = "/public/jurnal/api/v1/sales_invoices/2963983";
    println!("Sending GET request to {}...", path);

    let response = client.get(path).await?;
    println!("Status: {}", response.status());

    let body_text = response.text().await?;
    println!("Response Body:\n{}", body_text);

    Ok(())
}
