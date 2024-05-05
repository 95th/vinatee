import "@vaadin/split-layout";
import "./request/panel.js";
import "./response/panel.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { provide } from "@lit/context";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Request, RequestAuth, RequestBody, fetch } from "./fetch.js";
import {
    AuthorizationType,
    RequestBodyType,
    RequestState,
    ResponseState,
    requestContext,
    responseContext,
} from "./request/state.js";

@customElement("vin-app")
export class VinateeApp extends MobxLitElement {
    @provide({ context: requestContext })
    @state()
    private requestState = new RequestState();

    @provide({ context: responseContext })
    @state()
    private responseState = new ResponseState();

    override render() {
        return html`<vaadin-split-layout orientation="vertical">
            <request-panel
                style="min-height: 200px; height: 40%"
                @send=${this.onSend}
            ></request-panel>
            <response-panel style="min-height: 300px;"></response-panel>
        </vaadin-split-layout> `;
    }

    private async onSend() {
        this.responseState.clear();
        const authState = this.requestState.authorization;
        let auth: RequestAuth;
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
        let body: RequestBody;
        switch (bodyState.type) {
            case RequestBodyType.none:
                body = { type: "none" };
                break;
            case RequestBodyType.text:
                body = { type: "text", text: bodyState.text.toString() };
                break;
            case RequestBodyType.json:
                body = { type: "json", json: bodyState.json.toString() };
                break;
            case RequestBodyType.urlEncoded:
                body = { type: "form", form: bodyState.urlEncoded.entries };
                break;
            case RequestBodyType.file:
                body = { type: "file", path: bodyState.file };
        }

        const request: Request = {
            url: this.requestState.url,
            method: this.requestState.method,
            params: this.requestState.params.entries,
            headers: this.requestState.headers.entries,
            auth,
            body,
        };

        try {
            const response = await fetch(request, {
                acceptInvalidCerts: true,
            });
            const body = await response.arrayBuffer();
            this.responseState.setResponse(
                response.status,
                response.headers,
                body
            );
        } catch (err) {
            this.responseState.setError(JSON.stringify(err));
        }
    }
}
