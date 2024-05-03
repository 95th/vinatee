import "../components/editor.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestBodyState } from "./state.js";

@customElement("text-editor")
export class TextEditor extends MobxLitElement {
  @property({ attribute: false })
  body!: RequestBodyState;

  render() {
    return html`
      <vin-editor value=${this.body.text} @change=${this.onChange}></vin-editor>
    `;
  }

  onChange(event: CustomEvent<string>) {
    this.body.setJson(event.detail);
  }
}
