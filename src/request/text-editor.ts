import "../components/editor.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EditorTextChangedEvent } from "../components/editor.js";
import { RequestState, requestContext } from "./state.js";

@customElement("text-editor")
export class TextEditor extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    @property({ type: Boolean })
    wrapLines = false;

    override render() {
        return html`
            <vin-editor
                .value=${this.state.body.text}
                .wrapLines=${this.wrapLines}
                @change=${this.onChange}
            ></vin-editor>
        `;
    }

    private onChange(event: EditorTextChangedEvent) {
        this.state.body.setText(event.detail);
    }
}
