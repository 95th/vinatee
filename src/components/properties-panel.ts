import { MobxLitElement } from "@adobe/lit-mobx";
import { PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { PropertiesTabEvent } from "./events/PropertiesTabEvent.js";
import { PropertyDeleteEvent } from "./events/PropertyDeleteEvent.js";
import { Properties } from "./property-state.js";

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

    private onDelete(event: PropertyDeleteEvent) {
        this.properties.delete(event.detail.index);
    }

    private onTab(event: PropertiesTabEvent) {
        if (this.properties.entries.length === event.detail.index + 1) {
            this.properties.add();
        }
    }
}
