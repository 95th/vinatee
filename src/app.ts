import "@vaadin/vertical-layout";
import "./request/panel.js";
import "./request/url_bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { Properties, RequestState } from "./request/state.js";

@customElement("vin-app")
export class VinateeApp extends MobxLitElement {
  private requestState = new RequestState();

  render() {
    return html`<vaadin-vertical-layout
      theme="spacing padding"
      style="align-items: stretch"
    >
      <url-bar .state=${this.requestState} @send=${this.onSend}></url-bar>
      <request-properties .state=${this.requestState}></request-properties>
    </vaadin-vertical-layout>`;
  }

  onSend() {
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
