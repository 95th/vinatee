import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "./authorization.js";
import "./body.js";
import "./headers.js";
import "./query-params.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { RequestState } from "./state.js";

@customElement("request-properties")
export class RequestProperties extends MobxLitElement {
  @property({ attribute: false })
  state!: RequestState;

  @state()
  private selectedTabIndex = 0;

  render() {
    return html`<vaadin-tabsheet>
      <vaadin-tabs slot="tabs" @selected-changed=${this.onTabChange}>
        <vaadin-tab id="query-params-tab">Parameters</vaadin-tab>
        <vaadin-tab id="body-tab">Body</vaadin-tab>
        <vaadin-tab id="headers-tab">Headers</vaadin-tab>
        <vaadin-tab id="auth-tab">Authorization</vaadin-tab>
      </vaadin-tabs>

      ${this.renderControls()}

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

  private renderControls() {
    switch (this.selectedTabIndex) {
      case 0:
        return html`<properties-controls
          slot="suffix"
          .properties=${this.state.params}
        ></properties-controls>`;
      case 2:
        return html`<properties-controls
          slot="suffix"
          .properties=${this.state.headers}
        ></properties-controls>`;
      default:
        return html`<div slot="suffix" style="height: 2.75rem"></div>`;
    }
  }

  private onTabChange(e: TabSheetSelectedChangedEvent) {
    this.selectedTabIndex = e.detail.value;
  }
}
