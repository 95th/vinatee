import "@vaadin/button";
import "@vaadin/horizontal-layout";
import "@vaadin/select";
import "@vaadin/text-field";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { SelectValueChangedEvent } from "@vaadin/select";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

const methods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "PATCH",
    "CONNECT",
    "TRACE",
].map((method) => ({
    label: method,
    value: method,
}));

@customElement("url-bar")
export class UrlBar extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <vaadin-horizontal-layout theme="spacing">
                <vaadin-select
                    style="width: 10rem"
                    .items=${methods}
                    .value=${this.state.method}
                    @value-changed=${this.onMethodChange}
                >
                </vaadin-select>
                <vaadin-text-field
                    style="flex-grow: 1"
                    placeholder="Enter URL"
                    autocomplete="off"
                    value=${this.state.url}
                    @value-changed=${this.onUrlChange}
                ></vaadin-text-field>
                <vaadin-button theme="primary" @click=${this.onSend}>
                    Send
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    private onMethodChange(e: SelectValueChangedEvent) {
        this.state.setMethod(e.detail.value);
    }

    private onUrlChange(e: TextFieldValueChangedEvent) {
        this.state.setUrl(e.detail.value);
    }

    private onSend() {
        this.dispatchEvent(new SendEvent());
    }
}

export class SendEvent extends CustomEvent<void> {
    constructor() {
        super("send", { bubbles: true, composed: true });
    }
}
