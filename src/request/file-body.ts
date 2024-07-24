import { MobxLitElement } from "@adobe/lit-mobx";
import { consume } from "@lit/context";
import { open } from "@tauri-apps/plugin-dialog";
import { html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { RequestState, requestContext } from "./request-state.js";

@customElement("file-body")
export class FileBody extends MobxLitElement {
    @consume({ context: requestContext })
    private state!: RequestState;

    override render() {
        return html`
            <vaadin-horizontal-layout theme="spacing-s">
                <vaadin-button theme="secondary" @click=${this.selectFile}>
                    <vaadin-icon
                        icon="vaadin:cloud-upload"
                        slot="prefix"
                    ></vaadin-icon>
                    Select file
                </vaadin-button>
                ${this.renderFile()}
            </vaadin-horizontal-layout>
        `;
    }

    private renderFile() {
        if (!this.state.body.file) {
            return nothing;
        }

        const filename = this.state.body.file.split("/").pop();

        return html`
            <vaadin-horizontal-layout theme="spacing-s">
                <vaadin-custom-field>${filename}</vaadin-custom-field>
                <vaadin-button theme="tertiary-inline" @click=${this.clearFile}>
                    <vaadin-icon
                        icon="vaadin:close-small"
                        slot="prefix"
                    ></vaadin-icon>
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    private async selectFile() {
        const selected = await open({ multiple: false });
        if (selected) {
            this.state.body.setFile(selected.path);
        }
    }

    private clearFile() {
        this.state.body.setFile("");
    }
}
