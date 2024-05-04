import "../components/editor.js";

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestBodyState } from "./state.js";

@customElement("json-editor")
export class JsonEditor extends LitElement {
  @property({ attribute: false })
  body!: RequestBodyState;

  render() {
    return html`
      <vin-editor
        value=${this.body.json}
        language="json"
        @change=${this.onChange}
      ></vin-editor>
    `;
  }

  onChange(event: CustomEvent<string>) {
    this.body.setJson(event.detail);
  }
}
