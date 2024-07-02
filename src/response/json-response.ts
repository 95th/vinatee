

import { Text } from "@codemirror/state";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("json-response")
export class JsonResponse extends LitElement {
    @property({ attribute: false })
    body = new ArrayBuffer(0);

    @property({ attribute: false })
    prettify = false;

    @property({ attribute: false })
    wrapLines = false;

    override render() {
        const text = new TextDecoder().decode(this.body);
        const pretty = this.prettify ? this.convertToPrettyJson(text) : text;
        const json = Text.of(pretty.split("\n"));
        return html`<vin-editor
            .value=${json}
            .wrapLines=${this.wrapLines}
            language="json"
            readonly="true"
        ></vin-editor>`;
    }

    private convertToPrettyJson(text: string) {
        try {
            return JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            return text;
        }
    }
}
