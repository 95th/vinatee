import "@vaadin/tabs";
import "@vaadin/tabsheet";
import "./authorization.js";
import "./body.js";
import "./headers.js";
import "./query-params.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { TabSheetSelectedChangedEvent } from "@vaadin/tabsheet";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("request-properties")
export class RequestProperties extends MobxLitElement {
    @consume({ context: requestContext })
    @state()
    private state!: RequestState;

    @state()
    private selectedTabIndex = 0;

    render() {
        return html`<vaadin-tabsheet>
            <vaadin-tabs slot="tabs" @selected-changed=${this.onTabChange}>
                <vaadin-tab id="query-params-tab">Parameters</vaadin-tab>
                <vaadin-tab id="body-tab">Body</vaadin-tab>
                <vaadin-tab id="headers-tab">Headers</vaadin-tab>
                <vaadin-tab id="auth-tab">Authorization</vaadin-tab>
            </vaadin-tabs>

            ${this.renderControls()}

            <query-params tab="query-params-tab"></query-params>
            <request-body tab="body-tab"></request-body>
            <request-headers tab="headers-tab"></request-headers>
            <request-auth tab="auth-tab"></request-auth>
        </vaadin-tabsheet>`;
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
