import "@vaadin/button";
import "@vaadin/icon";
import "@vaadin/icons";

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("toggle-button")
export class ToggleButton extends LitElement {
    @property()
    value = false;

    override render() {
        return html`<vaadin-button theme="tertiary" @click=${this.onWrapToggle}>
            <vaadin-icon
                icon=${this.value
                    ? "vaadin:check-square-o"
                    : "vaadin:thin-square"}
                slot="prefix"
            ></vaadin-icon>
            <slot></slot>
        </vaadin-button>`;
    }

    private onWrapToggle() {
        this.dispatchEvent(new CustomEvent("toggle"));
    }
}
