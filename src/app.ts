import "@vaadin/vertical-layout";
import "./request/panel.js";
import "./request/url-bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { provide } from "@lit/context";
import { invoke } from "@tauri-apps/api/core";
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
        const authState = this.requestState.authorization;
        let auth: unknown;
        switch (authState.type) {
            case AuthorizationType.basic:
                auth = {
                    type: "basic",
                    username: authState.basicUsername,
                    password: authState.basicUsername,
                };
                break;
            case AuthorizationType.bearer:
                auth = { type: "bearer", token: authState.bearerToken };
                break;
            case AuthorizationType.none:
                auth = { type: "none" };
                break;
        }

        let bodyState = this.requestState.body;
        let body: unknown;
        switch (bodyState.type) {
            case RequestBodyType.none:
                body = { type: "none" };
                break;
            case RequestBodyType.text:
                body = { type: "text", text: bodyState.text };
                break;
            case RequestBodyType.json:
                body = { type: "json", json: bodyState.json };
                break;
            case RequestBodyType.urlEncoded:
                body = { type: "form", form: bodyState.urlEncoded.entries };
                break;
            case RequestBodyType.file:
                body = { type: "file", path: bodyState.file };
        }

        const request = {
            url: this.requestState.url,
            method: this.requestState.method,
            params: this.requestState.params.entries,
            headers: this.requestState.headers.entries,
            auth,
            body,
            disable_ssl_verify: false,
        };

        try {
            const code = await invoke("fetch", { request });
            console.log(code);
        } catch (err) {
            console.log(err);
        }
    }
}
