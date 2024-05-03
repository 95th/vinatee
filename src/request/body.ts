import "@vaadin/button";
import "@vaadin/horizontal-layout";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/select";
import "@vaadin/vertical-layout";
import "./file.js";
import "./json-editor.js";
import "./text-editor.js";
import "./url-encoded-form.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { SelectValueChangedEvent } from "@vaadin/select";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestBodyState, RequestBodyType } from "./state.js";

const bodyTypes = Object.values(RequestBodyType).map((type) => ({
  label: type,
  value: type,
}));

@customElement("request-body")
export class RequestBody extends MobxLitElement {
  @property({ attribute: false })
  body!: RequestBodyState;

  render() {
    return html`<vaadin-vertical-layout style="align-items: stretch">
      <vaadin-horizontal-layout style="justify-content: space-between">
        <vaadin-select
          .items=${bodyTypes}
          .value=${this.body.type}
          @value-changed=${this.onBodyTypeChange}
        ></vaadin-select>
        ${this.body.type === RequestBodyType.json
          ? html`<vaadin-button theme="tertiary" @click=${this.onJsonPrettify}>
              <vaadin-tooltip slot="tooltip" text="Prettify"></vaadin-tooltip>
              <vaadin-icon icon="vaadin:magic" slot="prefix"></vaadin-icon>
              Prettify
            </vaadin-button>`
          : nothing}
      </vaadin-horizontal-layout>

      ${this.renderBody()}
    </vaadin-vertical-layout>`;
  }

  private renderBody() {
    switch (this.body.type) {
      case RequestBodyType.urlEncoded:
        return html`<url-encoded-form
          .form=${this.body.urlEncoded}
        ></url-encoded-form>`;
      case RequestBodyType.json:
        return html`<json-editor .body=${this.body}></json-editor>`;
      case RequestBodyType.text:
        return html`<text-editor .body=${this.body}></text-editor>`;
      case RequestBodyType.file:
        return html`<file-body .body=${this.body}></file-body>`;
      default:
        return nothing;
    }
  }

  private onBodyTypeChange(event: SelectValueChangedEvent) {
    const type = event.detail.value as RequestBodyType;
    this.body.setType(type);
  }

  private onJsonPrettify() {
    const value = this.body.json;
    try {
      const json = JSON.parse(value);
      this.body.setJson(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error("Failed to prettify JSON", error);
    }
  }
}
