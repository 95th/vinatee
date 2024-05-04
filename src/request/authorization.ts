import "@vaadin/horizontal-layout";
import "@vaadin/select";
import "@vaadin/vertical-layout";
import "./basic-auth.js";
import "./bearer-auth.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { SelectValueChangedEvent } from "@vaadin/select";
import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AuthorizationType, RequestState, requestContext } from "./state.js";

const authTypes = Object.values(AuthorizationType).map((type) => ({
    label: type,
    value: type,
}));

@customElement("request-auth")
export class RequestAuthorization extends MobxLitElement {
    @consume({ context: requestContext })
    @state()
    private state!: RequestState;

    override render() {
        return html`<vaadin-vertical-layout style="align-items: stretch">
            <vaadin-horizontal-layout>
                <vaadin-select
                    .items=${authTypes}
                    .value=${this.state.authorization.type}
                    @value-changed=${this.onAuthTypeChange}
                ></vaadin-select>
            </vaadin-horizontal-layout>

            ${this.renderAuthBody()}
        </vaadin-vertical-layout>`;
    }

    private renderAuthBody() {
        switch (this.state.authorization.type) {
            case AuthorizationType.bearer:
                return html`<bearer-auth></bearer-auth>`;
            case AuthorizationType.basic:
                return html`<basic-auth></basic-auth>`;
            default:
                return nothing;
        }
    }

    private onAuthTypeChange(event: SelectValueChangedEvent) {
        const type = event.detail.value as AuthorizationType;
        this.state.authorization.setType(type);
    }
}
