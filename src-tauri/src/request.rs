use std::{sync::Arc, time::Duration};

use reqwest::{header::CONTENT_TYPE, Method};
use serde::{Deserialize, Serialize};
use tauri::{http::HeaderValue, Manager, ResourceId, Runtime, Webview};
use tokio::fs::File;

#[derive(Deserialize)]
#[serde(default)]
pub struct Request {
    method: String,
    url: String,
    params: Vec<Property>,
    headers: Vec<Property>,
    body: RequestBody,
    auth: RequestAuth,
}

impl Default for Request {
    fn default() -> Self {
        Self {
            method: String::from("GET"),
            url: Default::default(),
            params: Default::default(),
            headers: Default::default(),
            body: RequestBody::None,
            auth: RequestAuth::None,
        }
    }
}

#[derive(Default, Deserialize)]
#[serde(default)]
#[serde(rename_all = "camelCase")]
pub struct ClientOptions {
    /// Timeout in seconds
    connect_timeout: Option<u64>,

    /// Disable SSL verification
    accept_invalid_certs: Option<bool>,
}

#[derive(Deserialize)]
#[serde(tag = "type")]
enum RequestBody {
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
enum RequestAuth {
    #[serde(rename = "none")]
    None,

    #[serde(rename = "basic")]
    Basic { username: String, password: String },

    #[serde(rename = "bearer")]
    Bearer { token: String },
}

#[derive(Deserialize)]
struct Property {
    name: String,
    value: String,
    enabled: bool,
}

#[derive(Serialize)]
pub enum Error {
    File(String),
    Form(String),
    Request(String),
    InvalidResponseHeader,
    ResponseBodyRead(String),
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    status: u16,
    headers: Vec<(String, String)>,
    rid: ResourceId,
}

struct ResponseResource(reqwest::Response);

impl tauri::Resource for ResponseResource {}

#[tauri::command]
pub async fn fetch<R>(
    request: Request,
    options: ClientOptions,
    webview: Webview<R>,
) -> Result<Response, Error>
where
    R: Runtime,
{
    let mut client_builder = reqwest::Client::builder().user_agent("Vinatee/0.1");
    if let Some(accept_invalid_certs) = options.accept_invalid_certs {
        client_builder = client_builder.danger_accept_invalid_certs(accept_invalid_certs);
    }

    if let Some(connect_timeout) = options.connect_timeout {
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
        RequestAuth::None => (),
        RequestAuth::Basic { username, password } => {
            request_builder = request_builder.basic_auth(username, Some(password))
        }
        RequestAuth::Bearer { token } => request_builder = request_builder.bearer_auth(token),
    }

    match request.body {
        RequestBody::None => (),
        RequestBody::Text { text } => {
            request_builder = request_builder.body(text);
            if !has_content_type_header {
                request_builder =
                    request_builder.header(CONTENT_TYPE, HeaderValue::from_static("text/plain"));
            }
        }
        RequestBody::Json { json } => {
            request_builder = request_builder.body(json);
            if !has_content_type_header {
                request_builder = request_builder
                    .header(CONTENT_TYPE, HeaderValue::from_static("application/json"));
            }
        }
        RequestBody::File { path } => {
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
        RequestBody::Form { form } => {
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

    let mut headers = Vec::new();

    for (k, v) in response.headers().iter() {
        headers.push((
            k.to_string(),
            v.to_str()
                .map_err(|_| Error::InvalidResponseHeader)?
                .to_owned(),
        ));
    }

    let mut resources = webview.resources_table();
    let rid = resources.add(ResponseResource(response));

    Ok(Response {
        status: status.as_u16(),
        headers,
        rid,
    })
}

#[tauri::command]
pub async fn fetch_read_body<R>(
    webview: Webview<R>,
    rid: ResourceId,
) -> Result<tauri::ipc::Response, Error>
where
    R: Runtime,
{
    let response = {
        let mut resources = webview.resources_table();
        resources
            .take::<ResponseResource>(rid)
            .map_err(|_| Error::ResponseBodyRead("Cannot read response".to_string()))?
    };
    let response = Arc::into_inner(response).unwrap().0;
    let body = response
        .bytes()
        .await
        .map_err(|e| Error::ResponseBodyRead(e.to_string()))?;
    Ok(tauri::ipc::Response::new(Vec::from(body)))
}
