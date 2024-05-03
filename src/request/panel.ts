import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "./authorization.js";
import "./body.js";
import "./headers.js";
import "./query-params.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestState } from "./state.js";

@customElement("request-properties")
export class RequestProperties extends MobxLitElement {
  @property({ attribute: false })
  state!: RequestState;

  render() {
    return html`<vaadin-tabsheet>
      <vaadin-tabs slot="tabs">
        <vaadin-tab id="query-params-tab">Parameters</vaadin-tab>
        <vaadin-tab id="body-tab">Body</vaadin-tab>
        <vaadin-tab id="headers-tab">Headers</vaadin-tab>
        <vaadin-tab id="auth-tab">Authorization</vaadin-tab>
      </vaadin-tabs>

      <query-params
        tab="query-params-tab"
        .params=${this.state.params}
      ></query-params>
      <request-body tab="body-tab" .body=${this.state.body}></request-body>
      <request-headers
        tab="headers-tab"
        .headers=${this.state.headers}
      ></request-headers>
      <request-auth
        tab="auth-tab"
        .auth=${this.state.authorization}
      ></request-auth>
    </vaadin-tabsheet>`;
  }
}
