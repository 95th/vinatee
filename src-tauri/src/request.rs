use std::time::Duration;

use reqwest::{header::CONTENT_TYPE, Method};
use serde::{Deserialize, Serialize};
use tauri::http::HeaderValue;
use tokio::fs::File;

#[derive(Deserialize)]
#[serde(default)]
pub struct VinateeRequest {
    pub method: String,
    pub url: String,
    pub params: Vec<Property>,
    pub headers: Vec<Property>,
    pub body: VinateeRequestBody,
    pub auth: VinateeRequestAuth,

    /// Timeout in seconds
    pub connect_timeout: Option<u64>,

    /// Disable SSL verification
    pub disable_ssl_verify: bool,
}

impl Default for VinateeRequest {
    fn default() -> Self {
        Self {
            method: String::from("GET"),
            url: Default::default(),
            params: Default::default(),
            headers: Default::default(),
            body: VinateeRequestBody::None,
            auth: VinateeRequestAuth::None,
            connect_timeout: Some(30),
            disable_ssl_verify: false,
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum VinateeRequestBody {
    #[serde(rename = "none")]
    None,
    #[serde(rename = "json")]
    Json { json: String },
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "form")]
    Form { form: Vec<Property> },
    #[serde(rename = "file")]
    File { path: String },
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum VinateeRequestAuth {
    #[serde(rename = "none")]
    None,

    #[serde(rename = "basic")]
    Basic { username: String, password: String },

    #[serde(rename = "bearer")]
    Bearer { token: String },
}

#[derive(Deserialize)]
pub struct Property {
    pub name: String,
    pub value: String,
    pub enabled: bool,
}

#[derive(Serialize)]
pub enum Error {
    File(String),
    Form(String),
    Request(String),
    ResponseBodyRead(String),
}

#[tauri::command]
pub async fn fetch(request: VinateeRequest) -> Result<u16, Error> {
    let mut client_builder = reqwest::Client::builder()
        .user_agent("Vinatee/0.1")
        .danger_accept_invalid_certs(request.disable_ssl_verify);

    if let Some(connect_timeout) = request.connect_timeout {
        client_builder = client_builder.connect_timeout(Duration::from_secs(connect_timeout));
    }

    let client = client_builder.build().unwrap();

    let method = Method::from_bytes(request.method.as_bytes()).unwrap();
    let mut request_builder = client.request(method, request.url);

    for p in request.params {
        if p.enabled && !p.name.is_empty() {
            request_builder = request_builder.query(&[(p.name, p.value)]);
        }
    }

    let mut has_content_type_header = false;

    for p in request.headers {
        if p.enabled && !p.name.is_empty() {
            if p.name.eq_ignore_ascii_case("Content-Type") {
                has_content_type_header = true;
            }
            request_builder = request_builder.header(p.name, p.value);
        }
    }

    match request.auth {
        VinateeRequestAuth::None => (),
        VinateeRequestAuth::Basic { username, password } => {
            request_builder = request_builder.basic_auth(username, Some(password))
        }
        VinateeRequestAuth::Bearer { token } => {
            request_builder = request_builder.bearer_auth(token)
        }
    }

    match request.body {
        VinateeRequestBody::None => (),
        VinateeRequestBody::Text { text } => {
            request_builder = request_builder.body(text);
            if !has_content_type_header {
                request_builder =
                    request_builder.header(CONTENT_TYPE, HeaderValue::from_static("text/plain"));
            }
        }
        VinateeRequestBody::Json { json } => {
            request_builder = request_builder.body(json);
            if !has_content_type_header {
                request_builder = request_builder
                    .header(CONTENT_TYPE, HeaderValue::from_static("application/json"));
            }
        }
        VinateeRequestBody::File { path } => {
            let file = File::open(path)
                .await
                .map_err(|e| Error::File(e.to_string()))?;
            request_builder = request_builder.body(file);
            if !has_content_type_header {
                // TODO: Guess mimetype based on extension or magic number
                request_builder = request_builder.header(
                    CONTENT_TYPE,
                    HeaderValue::from_static("application/octet-stream"),
                );
            }
        }
        VinateeRequestBody::Form { form } => {
            let form: Vec<(String, String)> = form
                .into_iter()
                .filter(|p| p.enabled && !p.name.is_empty())
                .map(|p| (p.name, p.value))
                .collect();
            let form = serde_urlencoded::to_string(form).map_err(|e| Error::Form(e.to_string()))?;
            request_builder = request_builder.body(form);
            if !has_content_type_header {
                request_builder = request_builder.header(
                    CONTENT_TYPE,
                    HeaderValue::from_static("application/x-www-form-urlencoded"),
                );
            }
        }
    }

    let response = request_builder
        .send()
        .await
        .map_err(|e| Error::Request(e.to_string()))?;
    let status = response.status();
    let body = response
        .text()
        .await
        .map_err(|e| Error::ResponseBodyRead(e.to_string()))?;
    println!("{body}");

    Ok(status.as_u16())
}
