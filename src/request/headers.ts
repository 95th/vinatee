import "../components/properties-panel.js";

import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("request-headers")
export class RequestHeaders extends LitElement {
    @consume({ context: requestContext })
    @state()
    private state!: RequestState;

    override render() {
        return html`
            <properties-panel
                .properties=${this.state.headers}
            ></properties-panel>
        `;
    }
}
