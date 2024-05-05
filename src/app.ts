import "@vaadin/vertical-layout";
import "./request/panel.js";
import "./request/url-bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { provide } from "@lit/context";
import { readFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
    AuthorizationType,
    RequestBodyType,
    RequestState,
    requestContext,
} from "./request/state.js";

@customElement("vin-app")
export class VinateeApp extends MobxLitElement {
    @provide({ context: requestContext })
    @state()
    private requestState = new RequestState();

    override render() {
        return html`<vaadin-vertical-layout
            theme="spacing padding"
            style="align-items: stretch"
        >
            <url-bar @send=${this.onSend}></url-bar>
            <request-properties></request-properties>
        </vaadin-vertical-layout>`;
    }

    private async onSend() {
        const url = new URL(this.requestState.url);

        for (const p of this.requestState.params.entries) {
            if (p.enabled && p.name !== "") {
                url.searchParams.append(p.name, p.value);
            }
        }

        let hasContentTypeHeader = false;
        let hasAuthHeader = false;

        const headers: [string, string][] = [["User-Agent", "Vinatee/0.1"]];
        for (const p of this.requestState.headers.entries) {
            if (
                p.enabled &&
                p.name !== "" &&
                p.name.toLowerCase() !== "user-agent"
            ) {
                headers.push([p.name, p.value]);
                if (p.name.toLowerCase() === "content-type") {
                    hasContentTypeHeader = true;
                }
                if (p.name.toLowerCase() === "authorization") {
                    hasAuthHeader = true;
                }
            }
        }

        let body: BodyInit | undefined;

        switch (this.requestState.body.type) {
            case RequestBodyType.none:
                break;
            case RequestBodyType.text:
                if (!hasContentTypeHeader) {
                    headers.push(["Content-Type", "text/plain"]);
                }
                body = this.requestState.body.text.toString();
                break;
            case RequestBodyType.json:
                if (!hasContentTypeHeader) {
                    headers.push(["Content-Type", "application/json"]);
                }
                body = this.requestState.body.json.toString();
                break;
            case RequestBodyType.urlEncoded:
                if (!hasContentTypeHeader) {
                    headers.push([
                        "Content-Type",
                        "application/x-www-form-urlencoded",
                    ]);
                }
                body = new URLSearchParams();
                for (const p of this.requestState.body.urlEncoded.entries) {
                    if (p.enabled && p.name !== "") {
                        body.append(p.name, p.value);
                    }
                }
                break;
            case RequestBodyType.file:
                if (this.requestState.body.file !== "") {
                    if (!hasContentTypeHeader) {
                        // TODO: Guess mimetype from file extension or magic number
                        headers.push([
                            "Content-Type",
                            "application/octet-stream",
                        ]);
                    }
                    body = await readFile(this.requestState.body.file);
                }
                break;
        }

        if (!hasAuthHeader) {
            switch (this.requestState.authorization.type) {
                case AuthorizationType.none:
                    break;
                case AuthorizationType.basic:
                    const concatenated = `${this.requestState.authorization.basicUsername}:${this.requestState.authorization.basicPassword}`;
                    headers.push([
                        "Authorization",
                        `Basic ${btoa(concatenated)}`,
                    ]);
                    break;
                case AuthorizationType.bearer:
                    headers.push([
                        "Authorization",
                        `Bearer ${this.requestState.authorization.bearerToken}`,
                    ]);
                    break;
            }
        }

        const response = await fetch(url, {
            method: this.requestState.method,
            headers,
            body,
        });

        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(await response.text());
    }
}
