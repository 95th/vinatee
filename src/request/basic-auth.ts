import "@vaadin/text-field";
import "@vaadin/vertical-layout";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("basic-auth")
export class BasicAuth extends MobxLitElement {
    @consume({ context: requestContext })
    @state()
    private state!: RequestState;

    override render() {
        return html`<vaadin-vertical-layout style="align-items: stretch">
            <vaadin-text-field
                label="Username"
                .value=${this.state.authorization.basicUsername}
                @value-changed=${this.onUsernameChange}
            >
            </vaadin-text-field>
            <vaadin-text-field
                label="Password"
                .value=${this.state.authorization.basicPassword}
                @value-changed=${this.onPasswordChange}
            >
            </vaadin-text-field>
        </vaadin-vertical-layout>`;
    }

    private onUsernameChange(event: TextFieldValueChangedEvent) {
        this.state.authorization.setBasicUsername(event.detail.value);
    }

    private onPasswordChange(event: TextFieldValueChangedEvent) {
        this.state.authorization.setBasicPassword(event.detail.value);
    }
}
