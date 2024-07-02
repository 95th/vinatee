import { MobxLitElement } from "@adobe/lit-mobx";
import { CheckboxCheckedChangedEvent } from "@vaadin/checkbox";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties, Property } from "../request/state.js";

@customElement("properties-panel")
export class PropertiesPanel extends MobxLitElement {
    @property({ attribute: false })
    properties!: Properties;

    protected override willUpdate(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        if (this.properties.entries.length === 0) {
            this.properties.add();
        }
    }

    override render() {
        return this.properties.entries.map(
            (property, index) => html`
                <property-row
                    .property=${property}
                    .index=${index}
                    style="justify-content: end"
                    @delete=${this.onDelete}
                    @tab=${this.onTab}
                ></property-row>
            `
        );
    }

    private onDelete(event: DeletePropertyEvent) {
        this.properties.delete(event.detail.index);
    }

    private onTab(event: TabEvent) {
        if (this.properties.entries.length === event.detail.index + 1) {
            this.properties.add();
        }
    }
}

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
        this.dispatchEvent(new DeletePropertyEvent(this.index));
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
            this.dispatchEvent(new TabEvent(this.index));
        }
    }
}

class DeletePropertyEvent extends CustomEvent<{ index: number }> {
    constructor(index: number) {
        super("delete", {
            detail: { index },
        });
    }
}

class TabEvent extends CustomEvent<{ index: number }> {
    constructor(index: number) {
        super("tab", {
            detail: { index },
        });
    }
}
