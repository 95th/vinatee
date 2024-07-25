import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { SelectValueChangedEvent } from "@vaadin/select";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { EditorTextChangedEvent } from "../components/events/EditorTextChangedEvent.js";
import { RequestState, requestContext } from "./request-state.js";

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
    static override styles = css`
        code-editor {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    `;

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
                <code-editor
                    placeholder="Enter URL"
                    singleLine
                    .value=${this.state.url}
                    @change=${this.onUrlChange}
                ></code-editor>
                <vaadin-button
                    theme="primary"
                    style="cursor: pointer"
                    @click=${this.onSend}
                >
                    Send
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    private onMethodChange(e: SelectValueChangedEvent) {
        this.state.setMethod(e.detail.value);
    }

    private onUrlChange(e: EditorTextChangedEvent) {
        this.state.setUrl(e.detail);
    }

    private onSend() {
        this.dispatchEvent(
            new CustomEvent("send", { bubbles: true, composed: true })
        );
    }
}
