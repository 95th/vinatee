import "@vaadin/horizontal-layout";
import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "@vaadin/vertical-layout";
import "../components/toggle-button.js";
import "./json-response.js";
import "./response-headers.js";
import "./text-response.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { LitElement, PropertyValueMap, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { ResponseState, responseContext } from "../request/state.js";

@customElement("response-panel")
export class ResponsePanel extends MobxLitElement {
    @consume({ context: responseContext })
    private state!: ResponseState;

    @state()
    private selectedTabIndex = 0;

    @state()
    private tabs: string[] = [];

    @state()
    wrapLines = false;

    @state()
    jsonPrettify = false;

    private contentType() {
        return this.state.headers.get("Content-Type")?.split(";")[0];
    }

    protected override willUpdate(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        super.willUpdate(_changedProperties);
        if (this.state.status) {
            const tabs = [];
            const contentType = this.contentType();
            if (
                contentType?.includes("application/json") ||
                contentType?.endsWith("+json")
            ) {
                tabs.push("JSON");
            } else {
                tabs.push("Text");
            }

            tabs.push("Headers");
            this.tabs = tabs;
        }
    }

    override render() {
        if (!this.state.status) {
            return nothing;
        }

        return html`
            <vaadin-vertical-layout
                theme="padding"
                style="align-items: stretch"
            >
                <response-summary
                    .status=${this.state.status}
                    .statusText=${this.state.statusText}
                    .contentLength=${this.state.body.byteLength}
                    .contentType=${this.contentType()}
                    .headTime=${this.state.headTime}
                    .totalTime=${this.state.totalTime}
                ></response-summary>
                <vaadin-tabsheet @selected-changed=${this.onTabChange}>
                    <vaadin-tabs slot="tabs">
                        ${this.renderTabs()}
                    </vaadin-tabs>
                    ${this.renderControls()} ${this.renderTabContents()}
                </vaadin-tabsheet>
            </vaadin-vertical-layout>
        `;
    }

    private renderTabs() {
        return repeat(this.tabs, (tab) => {
            return html`<vaadin-tab id=${tab}>${tab}</vaadin-tab>`;
        });
    }

    private renderTabContents() {
        const tab = this.tabs[this.selectedTabIndex];
        // force re-rendering of the tab content when the tab changes
        switch (tab) {
            case "JSON":
                return html`<json-response
                    tab=${tab}
                    .body=${this.state.body}
                    .prettify=${this.jsonPrettify}
                    .wrapLines=${this.wrapLines}
                ></json-response>`;
            case "Text":
                return html`<text-response
                    tab=${tab}
                    .body=${this.state.body}
                    .wrapLines=${this.wrapLines}
                ></text-response>`;
            case "Headers":
                return html`<response-headers
                    tab=${tab}
                    .headers=${this.state.headers}
                ></response-headers>`;
            default:
                return nothing;
        }
    }

    private renderControls() {
        switch (this.tabs[this.selectedTabIndex]) {
            case "JSON":
                return html`<vaadin-horizontal-layout
                    slot="suffix"
                    theme="spacing"
                    style="justify-content: flex-end"
                >
                    <toggle-button
                        .value=${this.jsonPrettify}
                        @toggle=${this.onJsonPrettifyToggle}
                    >
                        Prettify
                    </toggle-button>
                    <toggle-button
                        .value=${this.wrapLines}
                        @toggle=${this.onWrapLinesToggle}
                        >Wrap lines</toggle-button
                    >
                </vaadin-horizontal-layout>`;
            case "Text":
                return html` <toggle-button
                    slot="suffix"
                    .value=${this.wrapLines}
                    @toggle=${this.onWrapLinesToggle}
                    >Wrap lines</toggle-button
                >`;
            default:
                return html`<div slot="suffix" style="height: 2.75rem"></div>`;
        }
    }

    private onTabChange(e: TabSheetSelectedChangedEvent) {
        this.selectedTabIndex = e.detail.value;
    }

    private onJsonPrettifyToggle() {
        this.jsonPrettify = !this.jsonPrettify;
    }

    private onWrapLinesToggle() {
        this.wrapLines = !this.wrapLines;
    }
}

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
