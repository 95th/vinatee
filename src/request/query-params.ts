import "../components/properties-panel.js";

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties } from "./state.js";

@customElement("query-params")
export class QueryParameters extends LitElement {
  @property({ attribute: false })
  params!: Properties;

  render() {
    return html`
      <properties-panel .properties=${this.params}></properties-panel>
    `;
  }
}
