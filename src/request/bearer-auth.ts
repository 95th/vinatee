import "@vaadin/text-area";

import { MobxLitElement } from "@adobe/lit-mobx";
import { TextAreaValueChangedEvent } from "@vaadin/text-area";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AuthorizationState } from "./state.js";

@customElement("bearer-auth")
export class BearerAuth extends MobxLitElement {
  @property({ attribute: false })
  auth!: AuthorizationState;

  render() {
    return html`
      <vaadin-text-area
        style="width:100%"
        label="Bearer token"
        .value=${this.auth.bearerToken}
        @value-changed=${this.onAuthTypeChange}
      ></vaadin-text-area>
    `;
  }

  private onAuthTypeChange(event: TextAreaValueChangedEvent) {
    this.auth.setBearerToken(event.detail.value);
  }
}
