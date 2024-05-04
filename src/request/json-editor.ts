import "../components/editor.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./state.js";

@customElement("json-editor")
export class JsonEditor extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <vin-editor
                value=${this.state.body.json}
                language="json"
                @change=${this.onChange}
            ></vin-editor>
        `;
    }

    private onChange(event: CustomEvent<string>) {
        this.state.body.setJson(event.detail);
    }
}
