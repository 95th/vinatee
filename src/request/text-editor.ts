import "../components/editor.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("text-editor")
export class TextEditor extends MobxLitElement {
    @consume({ context: requestContext })
    @state()
    private state!: RequestState;

    render() {
        return html`
            <vin-editor
                value=${this.state.body.text}
                @change=${this.onChange}
            ></vin-editor>
        `;
    }

    onChange(event: CustomEvent<string>) {
        this.state.body.setText(event.detail);
    }
}
