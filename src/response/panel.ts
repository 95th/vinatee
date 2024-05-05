import "@vaadin/horizontal-layout";
import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "@vaadin/vertical-layout";
import "./text-response.js";
import "./json-response.js";
import "./response-headers.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ResponseState, responseContext } from "../request/state.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("response-panel")
export class ResponsePanel extends MobxLitElement {
    @consume({ context: responseContext })
    private state!: ResponseState;

    @state()
    private selectedTabIndex = 0;

    override render() {
        if (!this.state.status) {
            return nothing;
        }

        const tabs = [];
        const contentType = this.state.headers
            .get("Content-Type")
            ?.split(";")[0];
        if (
            contentType?.includes("application/json") ||
            contentType?.endsWith("+json")
        ) {
            tabs.push("JSON");
        } else {
            tabs.push("Text");
        }

        tabs.push("Headers");

        return html`
            <vaadin-vertical-layout
                theme="padding"
                style="align-items: stretch"
            >
                <response-summary
                    .status=${this.state.status}
                    .statusText=${this.state.statusText}
                    .contentType=${contentType}
                    .headTime=${this.state.headTime}
                    .totalTime=${this.state.totalTime}
                ></response-summary>
                <vaadin-tabsheet>
                    <vaadin-tabs
                        slot="tabs"
                        @selected-changed=${this.onTabChange}
                    >
                        ${this.renderTabs(tabs)}
                    </vaadin-tabs>

                    ${this.renderTabContents(tabs)}
                </vaadin-tabsheet>
            </vaadin-vertical-layout>
        `;
    }

    private renderTabs(tabs: string[]) {
        return repeat(tabs, (tab) => {
            return html`<vaadin-tab id=${tab}>${tab}</vaadin-tab>`;
        });
    }

    private renderTabContents(tabs: string[]) {
        return repeat(tabs, (tab) => {
            if (tab === "JSON") {
                return html`<json-response
                    tab=${tab}
                    .body=${this.state.body}
                ></json-response>`;
            } else if (tab === "Headers") {
                return html`<response-headers
                    tab=${tab}
                    .headers=${this.state.headers}
                ></response-headers>`;
            } else if (tab === "Text") {
                return html`<text-response
                    tab=${tab}
                    .body=${this.state.body}
                ></text-response>`;
            } else {
                return nothing;
            }
        });
    }

    // private renderControls() {
    //     switch (this.selectedTabIndex) {
    //         case 0:
    //             return html`<properties-controls
    //                 slot="suffix"
    //                 .properties=${this.state.params}
    //             ></properties-controls>`;
    //         case 2:
    //             return html`<properties-controls
    //                 slot="suffix"
    //                 .properties=${this.state.headers}
    //             ></properties-controls>`;
    //         default:
    //             return html`<div slot="suffix" style="height: 2.75rem"></div>`;
    //     }
    // }

    private onTabChange(e: TabSheetSelectedChangedEvent) {
        this.selectedTabIndex = e.detail.value;
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
            <vaadin-horizontal-layout theme="spacing-l">
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
                    <span>Content-Type:</span>
                    <span style=${styleMap({ color })}
                        >${this.contentType}</span
                    >
                </vaadin-horizontal-layout>
            </vaadin-horizontal-layout>
        `;
    }
}
