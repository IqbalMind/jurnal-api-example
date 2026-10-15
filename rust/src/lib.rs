use base64::Engine;
use chrono::Utc;
use hmac::{Hmac, Mac};
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, AUTHORIZATION, CONTENT_TYPE, DATE};
use reqwest::{Client, Method, Response};
use sha2::Sha256;
use std::collections::HashMap;

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Clone)]
pub struct SignatureResult {
    pub date: String,
    pub request_line: String,
    pub signature: String,
    pub authorization_header: String,
}

#[derive(Clone)]
pub struct JurnalClient {
    pub username: String,
    pub secret: String,
    pub base_url: String,
    http_client: Client,
}

impl JurnalClient {
    pub fn new(username: impl Into<String>, secret: impl Into<String>, environment: &str) -> Self {
        let base_url = if environment.eq_ignore_ascii_case("production") {
            "https://api.mekari.com".to_string()
        } else {
            "https://sandbox-api.mekari.com".to_string()
        };

        Self {
            username: username.into(),
            secret: secret.into(),
            base_url,
            http_client: Client::new(),
        }
    }

    pub fn generate_signature(&self, method: &str, path: &str) -> SignatureResult {
        // RFC 7231 / HTTP-date GMT format (e.g. Thu, 15 Oct 2026 04:09:20 GMT)
        let date = Utc::now().format("%a, %d %b %Y %H:%M:%S GMT").to_string();
        let upper_method = method.to_ascii_uppercase();
        let request_line = format!("{} {} HTTP/1.1", upper_method, path);
        let string_to_sign = format!("date: {}\n{}", date, request_line);

        let mut mac = HmacSha256::new_from_slice(self.secret.as_bytes())
            .expect("HMAC can accept key of any size");
        mac.update(string_to_sign.as_bytes());
        let signature = base64::engine::general_purpose::STANDARD.encode(mac.finalize().into_bytes());

        let authorization_header = format!(
            r#"hmac username="{}", algorithm="hmac-sha256", headers="date request-line", signature="{}""#,
            self.username, signature
        );

        SignatureResult {
            date,
            request_line,
            signature,
            authorization_header,
        }
    }

    pub async fn request(
        &self,
        method: Method,
        path: &str,
        body: Option<serde_json::Value>,
        query_params: Option<&HashMap<&str, &str>>,
    ) -> Result<Response, reqwest::Error> {
        let mut full_path = path.to_string();
        if let Some(params) = query_params {
            if !params.is_empty() {
                let query = params
                    .iter()
                    .map(|(k, v)| format!("{}={}", urlencoding::encode(k), urlencoding::encode(v)))
                    .collect::<Vec<_>>()
                    .join("&");
                if full_path.contains('?') {
                    full_path.push('&');
                } else {
                    full_path.push('?');
                }
                full_path.push_str(&query);
            }
        }

        let sig = self.generate_signature(method.as_str(), &full_path);
        let url = format!("{}{}", self.base_url, full_path);

        let mut headers = HeaderMap::new();
        headers.insert(
            AUTHORIZATION,
            HeaderValue::from_str(&sig.authorization_header).unwrap(),
        );
        headers.insert(DATE, HeaderValue::from_str(&sig.date).unwrap());
        headers.insert(ACCEPT, HeaderValue::from_static("application/json"));

        let mut builder = self.http_client.request(method.clone(), &url).headers(headers);

        if let Some(json_body) = body {
            if method != Method::GET && method != Method::DELETE {
                builder = builder
                    .header(CONTENT_TYPE, "application/json")
                    .json(&json_body);
            }
        }

        builder.send().await
    }

    pub async fn get(&self, path: &str) -> Result<Response, reqwest::Error> {
        self.request(Method::GET, path, None, None).await
    }

    pub async fn post(
        &self,
        path: &str,
        body: serde_json::Value,
    ) -> Result<Response, reqwest::Error> {
        self.request(Method::POST, path, Some(body), None).await
    }

    pub async fn put(
        &self,
        path: &str,
        body: serde_json::Value,
    ) -> Result<Response, reqwest::Error> {
        self.request(Method::PUT, path, Some(body), None).await
    }

    pub async fn delete(&self, path: &str) -> Result<Response, reqwest::Error> {
        self.request(Method::DELETE, path, None, None).await
    }
}
