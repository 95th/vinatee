import "../components/properties-panel.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties } from "./state.js";

@customElement("url-encoded-form")
export class UrlEncodedForm extends MobxLitElement {
  @property({ attribute: false })
  form!: Properties;

  render() {
    return html`
      <properties-panel .properties=${this.form}></properties-panel>
    `;
  }
}
