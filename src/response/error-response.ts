import { typography } from "@vaadin/vaadin-lumo-styles/typography.js";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("error-response")
export class ErrorResponse extends LitElement {
    static override styles = [typography];

    @property()
    error = "";

    override render() {
        return html`<vaadin-vertical-layout
            theme="spacing"
            style="align-items: center; justify-content: center; height: 100%; padding-bottom: 6rem;"
        >
            <vaadin-icon
                style="color: var(--lumo-disabled-text-color); font-size: 3rem;"
                icon="vaadin:close-circle-o"
            ></vaadin-icon>
            <p style="color: var(--lumo-tertiary-text-color)">
                Error: ${this.error}
            </p>
        </vaadin-vertical-layout>`;
    }
}
