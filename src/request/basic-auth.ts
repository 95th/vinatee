import "@vaadin/text-field";
import "@vaadin/vertical-layout";

import { MobxLitElement } from "@adobe/lit-mobx";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AuthorizationState } from "./state.js";

@customElement("basic-auth")
export class BasicAuth extends MobxLitElement {
  @property({ attribute: false })
  auth!: AuthorizationState;

  render() {
    return html`<vaadin-vertical-layout style="align-items: stretch">
      <vaadin-text-field
        label="Username"
        .value=${this.auth.basicUsername}
        @value-changed=${this.onUsernameChange}
      >
      </vaadin-text-field>
      <vaadin-text-field
        label="Password"
        .value=${this.auth.basicPassword}
        @value-changed=${this.onPasswordChange}
      >
      </vaadin-text-field>
    </vaadin-vertical-layout>`;
  }

  private onUsernameChange(event: TextFieldValueChangedEvent) {
    this.auth.setBasicUsername(event.detail.value);
  }

  private onPasswordChange(event: TextFieldValueChangedEvent) {
    this.auth.setBasicPassword(event.detail.value);
  }
}
