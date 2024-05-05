import "./json-response.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ResponseState, responseContext } from "../request/state.js";

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
                <div>
                    <strong>Body:</strong>
                    ${this.renderBody()}
                </div>
            </div>
        `;
    }

    private renderHeaders() {
        return repeat(this.state.headers.entries(), ([name, value]) => {
            return html`<div><strong>${name}:</strong> ${value}</div>`;
        });
    }

    private renderBody() {
        const contentType = this.state.headers.get("Content-Type");
        if (
            contentType?.includes("application/json") ||
            contentType?.endsWith("+json")
        ) {
            return html`<json-response
                .body=${this.state.body}
                .wrapLines=${true}
            ></json-response>`;
        }

        return nothing;
    }
}
