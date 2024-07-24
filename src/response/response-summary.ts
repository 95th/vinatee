import { badge } from "@vaadin/vaadin-lumo-styles/badge.js";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("response-summary")
export class ResponseSummary extends LitElement {
    static override styles = [
        css`
            :host {
                font-family: var(--lumo-font-family);
                font-size: var(--lumo-font-size-s);
                line-height: var(--lumo-line-height-s);
                color: var(--lumo-body-text-color);
            }
        `,
        badge,
    ];

    @property({ type: Number, attribute: false })
    status = 0;

    @property({ type: String, attribute: false })
    statusText = "";

    @property({ type: Number, attribute: false })
    contentLength = 0;

    @property({ type: String, attribute: false })
    contentType = "";

    @property({ type: Number, attribute: false })
    headTime = 0;

    @property({ type: Number, attribute: false })
    totalTime = 0;

    override render() {
        const isOk = this.status >= 200 && this.status < 300;
        const theme = isOk ? "success" : "error";
        return html`
            <vaadin-horizontal-layout theme="spacing padding">
                <span theme="badge ${theme}">
                    Status: ${this.status} - ${this.statusText}
                </span>
                <span theme="badge">
                    Time: ${Math.round(this.totalTime)} ms (Head:
                    ${Math.round(this.headTime)} ms)
                </span>
                <span theme="badge">
                    Size: ${this.contentLength.toLocaleString()} bytes
                </span>
                ${this.contentType
                    ? html`
                          <span theme="badge">
                              Content-Type: ${this.contentType}
                          </span>
                      `
                    : nothing}
            </vaadin-horizontal-layout>
        `;
    }
}
