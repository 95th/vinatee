import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("vin-button")
export class VinButton extends LitElement {
  protected render() {
    return html`<button @click=${this.doThis}>Click dis!</button>`;
  }

  doThis() {
    console.log("doThis");
  }
}
