import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "@vaadin/vertical-layout";
import "./authorization.js";
import "./body.js";
import "./headers.js";
import "./query-params.js";
import "./url-bar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("request-panel")
export class RequestPanel extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    @state()
    private selectedTabIndex = 0;

    override render() {
        return html`
            <vaadin-vertical-layout
                theme="padding"
                style="align-items: stretch"
            >
                <url-bar></url-bar>
                <vaadin-tabsheet @selected-changed=${this.onTabChange}>
                    <vaadin-tabs
                        slot="tabs"
                        @selected-changed=${this.onTabChange}
                    >
                        <vaadin-tab id="query-params-tab">
                            Parameters
                        </vaadin-tab>
                        <vaadin-tab id="body-tab">Body</vaadin-tab>
                        <vaadin-tab id="headers-tab">Headers</vaadin-tab>
                        <vaadin-tab id="auth-tab">Authorization</vaadin-tab>
                    </vaadin-tabs>

                    ${this.renderControls()} ${this.renderTabContents()}
                </vaadin-tabsheet>
            </vaadin-vertical-layout>
        `;
    }

    private renderTabContents() {
        // force render of all tabs
        switch (this.selectedTabIndex) {
            case 0:
                return html`<query-params
                    tab="query-params-tab"
                ></query-params>`;
            case 1:
                return html`<request-body tab="body-tab"></request-body>`;
            case 2:
                return html`<request-headers
                    tab="headers-tab"
                ></request-headers>`;
            case 3:
                return html`<request-auth tab="auth-tab"></request-auth>`;
            default:
                return nothing;
        }
    }

    private renderControls() {
        switch (this.selectedTabIndex) {
            case 0:
                return html`<properties-controls
                    slot="suffix"
                    .properties=${this.state.params}
                ></properties-controls>`;
            case 2:
                return html`<properties-controls
                    slot="suffix"
                    .properties=${this.state.headers}
                ></properties-controls>`;
            default:
                return html`<div slot="suffix" style="height: 2.75rem"></div>`;
        }
    }

    private onTabChange(e: TabSheetSelectedChangedEvent) {
        this.selectedTabIndex = e.detail.value;
    }
}
