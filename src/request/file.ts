import "@vaadin/button";
import "@vaadin/custom-field";
import "@vaadin/horizontal-layout";
import "@vaadin/icon";
import "@vaadin/icons";

import { MobxLitElement } from "@adobe/lit-mobx";
import { open } from "@tauri-apps/api/dialog";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RequestBodyState } from "./state.js";

@customElement("file-body")
export class FileBody extends MobxLitElement {
  @property({ attribute: false })
  body!: RequestBodyState;

  render() {
    return html`
      <vaadin-horizontal-layout theme="spacing-s">
        <vaadin-button theme="secondary" @click=${this.selectFile}>
          <vaadin-icon icon="vaadin:cloud-upload" slot="prefix"></vaadin-icon>
          Select file
        </vaadin-button>
        ${this.renderFile()}
      </vaadin-horizontal-layout>
    `;
  }

  private renderFile() {
    if (!this.body.file) {
      return nothing;
    }

    const filename = this.body.file.split("/").pop();

    return html`
      <vaadin-horizontal-layout theme="spacing-s">
        <vaadin-custom-field>${filename}</vaadin-custom-field>
        <vaadin-button theme="tertiary-inline" @click=${this.clearFile}>
          <vaadin-icon icon="vaadin:close-small" slot="prefix"></vaadin-icon>
        </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  private async selectFile() {
    const selected = await open({ multiple: false });
    if (selected) {
      this.body.setFile(selected as string);
    }
  }

  private clearFile() {
    this.body.setFile("");
  }
}
