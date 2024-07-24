import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { PropertyValueMap, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ResponseState, responseContext } from "./response-state.js";

@customElement("response-panel")
export class ResponsePanel extends MobxLitElement {
    static override styles = css`
        vaadin-tab {
            cursor: pointer;
        }
    `;

    @consume({ context: responseContext })
    private state!: ResponseState;

    @state()
    private selectedTabIndex = 0;

    @state()
    private tabs: string[] = [];

    @state()
    wrapLines = true;

    @state()
    jsonPrettify = true;

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
        if (this.state.error !== "") {
            return html`<error-response
                error=${this.state.error}
            ></error-response>`;
        }

        if (!this.state.status) {
            return nothing;
        }

        return html`
            <vaadin-vertical-layout style="align-items: stretch">
                <response-summary
                    .status=${this.state.status}
                    .statusText=${this.state.statusText}
                    .contentLength=${this.state.body.byteLength}
                    .contentType=${this.contentType()}
                    .headTime=${this.state.headTime}
                    .totalTime=${this.state.totalTime}
                ></response-summary>
                <tab-view>
                    <vaadin-tabs
                        slot="tabs"
                        class="tabs"
                        @selected-changed=${this.onTabChange}
                    >
                        ${this.renderTabs()}
                    </vaadin-tabs>
                    ${this.renderControls()} ${this.renderTabContents()}
                </tab-view>
            </vaadin-vertical-layout>
        `;
    }

    private renderTabs() {
        return repeat(this.tabs, (tab) => {
            return html`<vaadin-tab>${tab}</vaadin-tab>`;
        });
    }

    private renderTabContents() {
        const tab = this.tabs[this.selectedTabIndex];
        if (tab === "JSON") {
            return html`<json-response
                slot="tab-content"
                .body=${this.state.body}
                .prettify=${this.jsonPrettify}
                .wrapLines=${this.wrapLines}
            ></json-response>`;
        } else if (tab === "Text") {
            return html`<text-response
                slot="tab-content"
                .body=${this.state.body}
                .wrapLines=${this.wrapLines}
            ></text-response>`;
        } else if (tab === "Headers") {
            return html`<response-headers
                slot="tab-content"
                .headers=${this.state.headers}
            ></response-headers>`;
        } else {
            return nothing;
        }
    }

    private renderControls() {
        switch (this.tabs[this.selectedTabIndex]) {
            case "JSON":
                return html`<vaadin-horizontal-layout
                    slot="controls"
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
                    slot="controls"
                    .value=${this.wrapLines}
                    @toggle=${this.onWrapLinesToggle}
                    >Wrap lines</toggle-button
                >`;
            default:
                return html`<div
                    slot="controls"
                    style="height: 2.75rem"
                ></div>`;
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
