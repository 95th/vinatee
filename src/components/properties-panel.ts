import "@vaadin/button";
import "@vaadin/checkbox";
import "@vaadin/horizontal-layout";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/text-field";
import "@vaadin/tooltip";
import "@vaadin/vertical-layout";

import { MobxLitElement } from "@adobe/lit-mobx";
import { CheckboxCheckedChangedEvent } from "@vaadin/checkbox";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import { PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Properties, Property } from "../request/state.js";

@customElement("properties-panel")
export class PropertiesPanel extends MobxLitElement {
  @property({ attribute: false })
  properties!: Properties;

  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties);
    if (this.properties.entries.length === 0) {
      this.properties.add();
    }
  }

  render() {
    return html`
      <vaadin-vertical-layout theme="spacing-xs" style="align-items: stretch">
        <vaadin-horizontal-layout
          theme="spacing-s"
          style="justify-content: end"
        >
          <vaadin-button theme="tertiary" @click=${this.onDeleteAll}>
            <vaadin-icon icon="vaadin:trash" slot="prefix"></vaadin-icon>
            Delete all
          </vaadin-button>
          <vaadin-button theme="tertiary" @click=${this.onAdd}>
            <vaadin-icon icon="vaadin:plus" slot="prefix"></vaadin-icon>
            Add
          </vaadin-button>
        </vaadin-horizontal-layout>
        ${this.renderPropertyRows()}
      </vaadin-vertical-layout>
    `;
  }

  private renderPropertyRows() {
    return this.properties.entries.map(
      (property, index) => html`
        <property-row
          .property=${property}
          .index=${index}
          style="justify-content: end"
          @delete=${this.onDelete}
          @property-changed=${this.onChange}
        ></property-row>
      `
    );
  }

  private onAdd() {
    this.properties.add();
  }

  private onChange(event: PropertyChangedEvent) {
    const { index, property } = event.detail;
    this.properties.update(index, property);
  }

  private onDeleteAll() {
    this.properties.deleteAll();
  }

  private onDelete(event: DeletePropertyEvent) {
    this.properties.delete(event.detail.index);
  }
}

@customElement("property-row")
export class PropertyRow extends MobxLitElement {
  @property({ attribute: false })
  property!: Property;

  @property({ type: Number })
  index!: number;

  render() {
    return html`
      <vaadin-horizontal-layout theme="spacing-s">
        <vaadin-checkbox
          style="align-self: center;"
          .checked=${this.property.enabled}
          @checked-changed=${this.onEnabledChange}
        ></vaadin-checkbox>
        <vaadin-text-field
          style="flex-grow: 1;"
          placeholder="Name"
          .value=${this.property.name}
          @value-changed=${this.onNameChange}
        ></vaadin-text-field>
        <vaadin-text-field
          style="flex-grow: 1;"
          placeholder="Value"
          .value=${this.property.value}
          @value-changed=${this.onValueChange}
        ></vaadin-text-field>
        <vaadin-button theme="tertiary icon" @click=${this.onDelete}>
          <vaadin-tooltip slot="tooltip" text="Delete"></vaadin-tooltip>
          <vaadin-icon icon="vaadin:minus"></vaadin-icon>
        </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  private onDelete() {
    this.dispatchEvent(new DeletePropertyEvent(this.index));
  }

  private onEnabledChange(e: CheckboxCheckedChangedEvent) {
    this.dispatchEvent(
      new PropertyChangedEvent(this.index, { enabled: e.detail.value })
    );
  }

  private onNameChange(e: TextFieldValueChangedEvent) {
    this.dispatchEvent(
      new PropertyChangedEvent(this.index, { name: e.detail.value })
    );
  }

  private onValueChange(e: TextFieldValueChangedEvent) {
    this.dispatchEvent(
      new PropertyChangedEvent(this.index, { value: e.detail.value })
    );
  }
}

export class DeletePropertyEvent extends CustomEvent<{ index: number }> {
  constructor(index: number) {
    super("delete", {
      detail: { index },
      bubbles: true,
      composed: true,
    });
  }
}

export class PropertyChangedEvent extends CustomEvent<{
  index: number;
  property: Partial<Property>;
}> {
  constructor(index: number, property: Partial<Property>) {
    super("property-changed", {
      detail: { index, property },
      bubbles: true,
      composed: true,
    });
  }
}
