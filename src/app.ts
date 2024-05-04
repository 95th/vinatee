import "@vaadin/vertical-layout";
import "./request/panel.js";
import "./request/url_bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { provide } from "@lit/context";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Properties, RequestState, requestContext } from "./request/state.js";

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

    private onSend() {
        console.log("Send request");
        console.log(this.requestState.method, this.requestState.url);

        printProperties("Headers:", this.requestState.headers);
        printProperties("Parameters:", this.requestState.params);

        console.log("Body:");
        console.log("Type=", this.requestState.body.type);
        console.log("Text=", this.requestState.body.text);
        console.log("JSON=", this.requestState.body.json);
        printProperties("URL Encoded form:", this.requestState.body.urlEncoded);
        console.log("File=", this.requestState.body.file);

        console.log("Authorization:");
        console.log("Type=", this.requestState.authorization.type);
        console.log("Token=", this.requestState.authorization.bearerToken);
        console.log("Username=", this.requestState.authorization.basicUsername);
        console.log("Password=", this.requestState.authorization.basicPassword);
    }
}

function printProperties(title: string, properties: Properties) {
    console.log(title);
    for (const p of properties.entries) {
        console.log(`${p.name} = ${p.value} (enabled=${p.enabled})`);
    }
}
