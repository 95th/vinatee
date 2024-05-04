import "../components/editor.js";

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestBodyState } from "./state.js";

@customElement("text-editor")
export class TextEditor extends LitElement {
  @property({ attribute: false })
  body!: RequestBodyState;

  render() {
    return html`
      <vin-editor value=${this.body.text} @change=${this.onChange}></vin-editor>
    `;
  }

  onChange(event: CustomEvent<string>) {
    this.body.setText(event.detail);
  }
}
