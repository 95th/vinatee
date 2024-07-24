import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./request-state.js";

@customElement("basic-auth")
export class BasicAuth extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`<vaadin-horizontal-layout
            theme="spacing"
            style="align-items: stretch"
        >
            <vaadin-text-field
                label="Username"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                .value=${this.state.authorization.basicUsername}
                @value-changed=${this.onUsernameChange}
            >
            </vaadin-text-field>
            <vaadin-text-field
                label="Password"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                .value=${this.state.authorization.basicPassword}
                @value-changed=${this.onPasswordChange}
            >
            </vaadin-text-field>
        </vaadin-horizontal-layout>`;
    }

    private onUsernameChange(event: TextFieldValueChangedEvent) {
        this.state.authorization.setBasicUsername(event.detail.value);
    }

    private onPasswordChange(event: TextFieldValueChangedEvent) {
        this.state.authorization.setBasicPassword(event.detail.value);
    }
}
