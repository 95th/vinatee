import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties } from "../request/state.js";

@customElement("properties-controls")
export class PropertiesControls extends MobxLitElement {
    static override styles = css`
        vaadin-button {
            cursor: pointer;
        }
    `;

    @property({ attribute: false })
    properties!: Properties;

    override render() {
        return html`
            <vaadin-horizontal-layout
                theme="spacing-s"
                style="justify-content: end"
            >
                <vaadin-button theme="tertiary" @click=${this.onDeleteAll}>
                    <vaadin-icon
                        icon="vaadin:trash"
                        slot="prefix"
                    ></vaadin-icon>
                    Delete all
                </vaadin-button>
                <vaadin-button theme="tertiary" @click=${this.onAdd}>
                    <vaadin-icon icon="vaadin:plus" slot="prefix"></vaadin-icon>
                    Add
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    private onAdd() {
        this.properties.add();
    }

    private onDeleteAll() {
        this.properties.deleteAll();
    }
}
