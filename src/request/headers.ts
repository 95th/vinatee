import "../components/properties-panel.js";

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties } from "./state.js";

@customElement("request-headers")
export class RequestHeaders extends LitElement {
  @property({ attribute: false })
  headers!: Properties;

  render() {
    return html`
      <properties-panel .properties=${this.headers}></properties-panel>
    `;
  }
}
