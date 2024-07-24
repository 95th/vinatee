import { MobxLitElement } from "@adobe/lit-mobx";
import { CheckboxCheckedChangedEvent } from "@vaadin/checkbox";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PropertiesTabEvent } from "./events/PropertiesTabEvent.js";
import { PropertyDeleteEvent } from "./events/PropertyDeleteEvent.js";
import { Property } from "./property-state.js";

@customElement("property-row")
export class PropertyRow extends MobxLitElement {
    @property({ attribute: false })
    property!: Property;

    @property({ type: Number })
    index!: number;

    override render() {
        return html`
            <vaadin-horizontal-layout theme="spacing-s">
                <vaadin-checkbox
                    style="align-self: center; cursor: pointer;"
                    tabindex="-1"
                    .checked=${this.property.enabled}
                    @checked-changed=${this.onEnabledChange}
                ></vaadin-checkbox>
                <vaadin-text-field
                    style="flex-grow: 1;"
                    placeholder="Name"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    .value=${this.property.name}
                    @value-changed=${this.onNameChange}
                ></vaadin-text-field>
                <vaadin-text-field
                    style="flex-grow: 1;"
                    placeholder="Value"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    .value=${this.property.value}
                    @keydown=${this.onKeydown}
                    @value-changed=${this.onValueChange}
                ></vaadin-text-field>
                <vaadin-button
                    tabindex="-1"
                    theme="tertiary icon"
                    style="cursor: pointer;"
                    @click=${this.onDelete}
                >
                    <vaadin-tooltip
                        slot="tooltip"
                        text="Delete"
                    ></vaadin-tooltip>
                    <vaadin-icon icon="vaadin:minus"></vaadin-icon>
                </vaadin-button>
            </vaadin-horizontal-layout>
        `;
    }

    private onDelete() {
        this.dispatchEvent(new PropertyDeleteEvent(this.index));
    }

    private onEnabledChange(e: CheckboxCheckedChangedEvent) {
        this.property.setEnabled(e.detail.value);
    }

    private onNameChange(e: TextFieldValueChangedEvent) {
        this.property.setName(e.detail.value);
    }

    private onValueChange(e: TextFieldValueChangedEvent) {
        this.property.setValue(e.detail.value);
    }

    private onKeydown(e: KeyboardEvent) {
        if (
            e.key === "Tab" &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.metaKey
        ) {
            this.dispatchEvent(new PropertiesTabEvent(this.index));
        }
    }
}
