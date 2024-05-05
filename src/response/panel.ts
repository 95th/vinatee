import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { ResponseState, responseContext } from "../request/state";
import { repeat } from "lit/directives/repeat.js";

@customElement("response-panel")
export class ResponsePanel extends MobxLitElement {
    @consume({ context: responseContext })
    private state!: ResponseState;

    override render() {
        if (!this.state.status) {
            return nothing;
        }

        return html`
            <div>
                <h2>Response</h2>
                <div>
                    <strong>Status:</strong> ${this.state.status}
                    ${this.renderHeaders()}
                </div>
            </div>
        `;
    }

    private renderHeaders() {
        return repeat(this.state.headers.entries(), ([name, value]) => {
            return html`<div><strong>${name}:</strong> ${value}</div>`;
        });
    }
}
