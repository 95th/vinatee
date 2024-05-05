import "@vaadin/vertical-layout";
import "./request/panel.js";
import "./request/url-bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { provide } from "@lit/context";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Request, RequestAuth, RequestBody, fetch } from "./fetch.js";
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
            console.log(response.status);
            console.log(await response.text());
        } catch (err) {
            console.log(err);
        }
    }
}
