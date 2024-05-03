import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "prism-code-editor/prism/languages/json";
import {
  PrismEditorElement,
  addBasicEditor,
} from "prism-code-editor/web-component";

addBasicEditor("prism-editor");

@customElement("vin-editor")
export class VinEditor extends LitElement {
  @property()
  value = "value";

  @property()
  language = "";

  @query("prism-editor")
  editor!: PrismEditorElement;

  render() {
    return html`<prism-editor
      theme="github-light"
      tab-size="2"
      line-numbers
      insert-spaces
      word-wrap
      style="font-size: 1rem"
      @change=${this.onChange}
    ></prism-editor>`;
  }

  onChange() {
    this.dispatchEvent(
      new CustomEvent<string>("change", {
        detail: this.editor.value,
        bubbles: true,
        composed: true,
      })
    );
  }

  protected firstUpdated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(changedProperties);
    this.editor.addEventListener("ready", () => {
      this.editor.value = this.value;
      this.editor.language = this.language;
    });
  }
}
