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
                    Time: ${this.formatMs(this.totalTime)} (Head:
                    ${this.formatMs(this.headTime)})
                </span>
                <span theme="badge">
                    Size: ${this.formatBytes(this.contentLength)}
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

    private formatBytes(bytes: number): string {
        const sizes = ["B", "kB", "MB", "GB", "TB"];
        if (bytes === 0) {
            return "0 B";
        }
        const i = Math.floor(Math.log(bytes) / Math.log(1000));
        const formattedValue = (bytes / Math.pow(1000, i)).toFixed(2);
        return `${formattedValue} ${sizes[i]}`;
    }

    private formatMs(ms: number): string {
        if (ms < 1000) {
            return `${Math.round(ms)} ms`;
        }

        const seconds = ms / 1000;
        return `${seconds.toFixed(2)} s`;
    }
}
