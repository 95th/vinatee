import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./request-state.js";

@customElement("query-params")
export class QueryParameters extends LitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <properties-panel
                .properties=${this.state.params}
            ></properties-panel>
        `;
    }
}
