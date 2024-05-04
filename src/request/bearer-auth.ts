import "@vaadin/text-area";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TextAreaValueChangedEvent } from "@vaadin/text-area";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("bearer-auth")
export class BearerAuth extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <vaadin-text-area
                style="width:100%"
                label="Bearer token"
                .value=${this.state.authorization.bearerToken}
                @value-changed=${this.onAuthTypeChange}
            ></vaadin-text-area>
        `;
    }

    private onAuthTypeChange(event: TextAreaValueChangedEvent) {
        this.state.authorization.setBearerToken(event.detail.value);
    }
}
