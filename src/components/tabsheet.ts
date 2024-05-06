import "@vaadin/tabs";
import "@vaadin/horizontal-layout";

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("vin-tabsheet")
export class VinTabsheet extends LitElement {
    static override styles = css`
        .tabsheet {
            box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
        }

        ::slotted([slot="tabs"]) {
            flex-grow: 1;
            box-shadow: initial;
        }
    `;

    override render() {
        return html`
            <vaadin-horizontal-layout class="tabsheet">
                <slot name="tabs"></slot>
                <slot name="controls"></slot>
            </vaadin-horizontal-layout>
            <slot name="tab-content"></slot>
        `;
    }
}
