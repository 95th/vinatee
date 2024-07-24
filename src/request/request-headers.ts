import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./request-state.js";

@customElement("request-headers")
export class RequestHeaders extends LitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <properties-panel
                .properties=${this.state.headers}
            ></properties-panel>
        `;
    }
}
