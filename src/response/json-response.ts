import "../components/editor.js";

import { Text } from "@codemirror/state";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("json-response")
export class JsonResponse extends LitElement {
    @property({ attribute: false })
    body = new ArrayBuffer(0);

    override render() {
        const text = new TextDecoder().decode(this.body);
        const json = Text.of(text.split("\n"));
        return html`<vin-editor
            .value=${json}
            .wrapLines=${false}
            language="json"
            readonly="true"
        ></vin-editor>`;
    }
}
