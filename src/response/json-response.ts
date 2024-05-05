import "../components/editor.js";

import { Text } from "@codemirror/state";
import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("json-response")
export class JsonResponse extends LitElement {
    @property({ attribute: false })
    body = new ArrayBuffer(0);

    @state()
    json = Text.empty;

    @property({ type: Boolean })
    wrapLines = false;

    protected override willUpdate(
        changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        super.willUpdate(changedProperties);
        if (changedProperties.has("body")) {
            const text = new TextDecoder().decode(this.body);
            this.json = Text.of(text.split("\n"));
        }
    }

    override render() {
        return html`<vin-editor
            .value=${this.json}
            .wrapLines=${this.wrapLines}
            language="json"
            readonly="true"
        ></vin-editor>`;
    }
}
