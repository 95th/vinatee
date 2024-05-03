import "@vaadin/select";
import "@vaadin/vertical-layout";
import "@vaadin/horizontal-layout";
import "./bearer-auth.js";
import "./basic-auth.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { SelectValueChangedEvent } from "@vaadin/select";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AuthorizationState, AuthorizationType } from "./state.js";

const authTypes = Object.values(AuthorizationType).map((type) => ({
  label: type,
  value: type,
}));

@customElement("request-auth")
export class RequestAuthorization extends MobxLitElement {
  @property({ attribute: false })
  auth!: AuthorizationState;

  render() {
    return html`<vaadin-vertical-layout style="align-items: stretch">
      <vaadin-horizontal-layout>
        <vaadin-select
          .items=${authTypes}
          .value=${this.auth.type}
          @value-changed=${this.onAuthTypeChange}
        ></vaadin-select>
      </vaadin-horizontal-layout>

      ${this.renderAuthBody()}
    </vaadin-vertical-layout>`;
  }

  private renderAuthBody() {
    switch (this.auth.type) {
      case AuthorizationType.bearer:
        return html`<bearer-auth .auth=${this.auth}></bearer-auth>`;
      case AuthorizationType.basic:
        return html`<basic-auth .auth=${this.auth}></basic-auth>`;
      default:
        return nothing;
    }
  }

  private onAuthTypeChange(event: SelectValueChangedEvent) {
    const type = event.detail.value as AuthorizationType;
    this.auth.setType(type);
  }
}
