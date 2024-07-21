import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("response-summary")
export class ResponseSummary extends LitElement {
    static override styles = css`
        :host {
            font-family: var(--lumo-font-family);
            font-size: var(--lumo-font-size-s);
            line-height: var(--lumo-line-height-s);
            color: var(--lumo-body-text-color);
        }
    `;

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
        const color = isOk
            ? "var(--lumo-success-text-color)"
            : "var(--lumo-error-text-color)";
        return html`
            <vaadin-horizontal-layout theme="spacing-l padding">
                <vaadin-horizontal-layout theme="spacing-s">
                    <span>Status:</span>
                    <span style=${styleMap({ color })}
                        >${this.status} - ${this.statusText}
                    </span>
                </vaadin-horizontal-layout>
                <span>|</span>
                <vaadin-horizontal-layout theme="spacing-s">
                    <span>Time:</span>
                    <span style=${styleMap({ color })}>
                        ${Math.round(this.totalTime)} ms (Head:
                        ${Math.round(this.headTime)} ms)
                    </span>
                </vaadin-horizontal-layout>
                <span>|</span>
                <vaadin-horizontal-layout theme="spacing-s">
                    <span>Size:</span>
                    <span style=${styleMap({ color })}>
                        ${this.contentLength.toLocaleString()} bytes
                    </span>
                </vaadin-horizontal-layout>
                ${this.contentType
                    ? html`<span>|</span>
                          <vaadin-horizontal-layout theme="spacing-s">
                              <span>Content-Type:</span>
                              <span style=${styleMap({ color })}
                                  >${this.contentType}</span
                              >
                          </vaadin-horizontal-layout>`
                    : nothing}
            </vaadin-horizontal-layout>
        `;
    }
}
