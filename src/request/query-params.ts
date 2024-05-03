import "../components/properties-panel.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties } from "./state.js";

@customElement("query-params")
export class QueryParameters extends MobxLitElement {
  @property({ attribute: false })
  params!: Properties;

  render() {
    return html`
      <properties-panel .properties=${this.params}></properties-panel>
    `;
  }
}
