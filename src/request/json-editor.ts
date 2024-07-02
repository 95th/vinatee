import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EditorTextChangedEvent } from "../components/editor.js";
import { RequestState, requestContext } from "./state.js";

@customElement("json-editor")
export class JsonEditor extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    @property({ type: Boolean })
    wrapLines = false;

    override render() {
        return html`
            <vin-editor
                .value=${this.state.body.json}
                .wrapLines=${this.wrapLines}
                language="json"
                @change=${this.onChange}
            ></vin-editor>
        `;
    }

    private onChange(event: EditorTextChangedEvent) {
        this.state.body.setJson(event.detail);
    }
}
