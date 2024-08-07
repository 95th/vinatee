import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./request-state.js";

@customElement("url-encoded-form")
export class UrlEncodedForm extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <properties-panel
                .properties=${this.state.body.urlEncoded}
            ></properties-panel>
        `;
    }
}
