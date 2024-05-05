import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("response-headers")
export class ResponseHeadersPanel extends LitElement {
    @property({ attribute: false })
    public headers = new Headers();

    override render() {
        return html`
            ${Array.from(this.headers.entries()).map(
                ([name, value]) =>
                    html`<div><strong>${name}:</strong> ${value}</div> `
            )}
        `;
    }
}
