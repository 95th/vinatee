import { invoke } from "@tauri-apps/api/core";

export interface ClientOptions {
    /**
     * Whether to accept invalid SSL certificates.
     */
    acceptInvalidCerts?: boolean;

    /**
     * The timeout in seconds for the connection to be established.
     */
    connectTimeout?: number;
}

export interface Request {
    method: string;
    url: string;
    params: Property[];
    headers: Property[];
    auth: RequestAuth;
    body: RequestBody;
}

export type RequestAuth = NoAuth | BasicAuth | BearerAuth;

interface NoAuth {
    type: "none";
}

interface BasicAuth {
    type: "basic";
    username: string;
    password: string;
}

interface BearerAuth {
    type: "bearer";
    token: string;
}

export type RequestBody = NoBody | TextBody | JsonBody | FormBody | FileBody;

interface NoBody {
    type: "none";
}

interface TextBody {
    type: "text";
    text: string;
}

interface JsonBody {
    type: "json";
    json: string;
}

interface FormBody {
    type: "form";
    form: Property[];
}

interface FileBody {
    type: "file";
    path: string;
}

interface Property {
    name: string;
    value: string;
    enabled: boolean;
}

interface IpcResponseHead {
    status: number;
    statusText: string;
    headers: [string, string][];
    rid: number;
}

export interface FetchResponse {
    response: Response;
    headTime: number;
    totalTime: number;
}

export async function fetch(
    request: Request,
    options: ClientOptions = {}
): Promise<FetchResponse> {
    const start = performance.now();
    const head: IpcResponseHead = await invoke("fetch", { request, options });
    const headTime = performance.now() - start;
    const body: ArrayBuffer = await invoke("fetch_read_body", {
        rid: head.rid,
    });
    const totalTime = performance.now() - start;

    const response = new Response(body, {
        headers: head.headers,
        status: head.status,
        statusText: head.statusText,
    });
    return { response, headTime, totalTime };
}
