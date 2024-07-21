import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("response-headers")
export class ResponseHeadersPanel extends LitElement {
    @property({ attribute: false })
    public headers = new Headers();

    override render() {
        const headers = Array.from(this.headers.entries()).map(
            ([name, value]) => ({ name, value })
        );
        return html`
            <vaadin-grid theme="no-border" .items="${headers}" all-rows-visible>
                <vaadin-grid-sort-column
                    header="Name"
                    path="name"
                ></vaadin-grid-sort-column>
                <vaadin-grid-column
                    header="Value"
                    path="value"
                ></vaadin-grid-column>
            </vaadin-grid>
        `;
    }
}
