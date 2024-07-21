import { MobxLitElement } from "@adobe/lit-mobx";
import { Text } from "@codemirror/state";
import { consume } from "@lit/context";
import { SelectValueChangedEvent } from "@vaadin/select";
import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EditorTextChangedEvent } from "../components/events/EditorTextChangedEvent.js";
import { RequestBodyType, RequestState, requestContext } from "./state.js";

const bodyTypes = Object.values(RequestBodyType).map((type) => ({
    label: type,
    value: type,
}));

@customElement("request-body")
export class RequestBody extends MobxLitElement {
    static override styles = css`
        vaadin-button {
            cursor: pointer;
        }
    `;

    @consume({ context: requestContext })
    private state!: RequestState;

    @state()
    wrapLines = true;

    override render() {
        return html`<vaadin-vertical-layout style="align-items: stretch">
            <vaadin-horizontal-layout style="justify-content: space-between">
                <vaadin-select
                    .items=${bodyTypes}
                    .value=${this.state.body.type}
                    @value-changed=${this.onBodyTypeChange}
                ></vaadin-select>
                ${this.renderControls()}
            </vaadin-horizontal-layout>

            ${this.renderBody()}
        </vaadin-vertical-layout>`;
    }

    private renderControls() {
        switch (this.state.body.type) {
            case RequestBodyType.json:
                return html`<vaadin-horizontal-layout
                    theme="spacing"
                    style="justify-content: flex-end"
                >
                    <vaadin-button
                        theme="tertiary"
                        @click=${this.onJsonPrettify}
                    >
                        <vaadin-icon
                            icon="vaadin:magic"
                            slot="prefix"
                        ></vaadin-icon>
                        Prettify
                    </vaadin-button>
                    <vaadin-button theme="tertiary" @click=${this.onJsonMinify}>
                        <vaadin-icon
                            icon="vaadin:compress-square"
                            slot="prefix"
                        ></vaadin-icon>
                        Minify
                    </vaadin-button>
                    <toggle-button
                        .value=${this.wrapLines}
                        @toggle=${this.onWrapLinesToggle}
                    >
                        Wrap lines
                    </toggle-button>
                </vaadin-horizontal-layout>`;
            case RequestBodyType.text:
                return html`<toggle-button
                    .value=${this.wrapLines}
                    @toggle=${this.onWrapLinesToggle}
                >
                    Wrap lines
                </toggle-button>`;
            case RequestBodyType.urlEncoded:
                return html`<properties-controls
                    .properties=${this.state.body.urlEncoded}
                ></properties-controls>`;
            default:
                nothing;
        }
    }

    private renderBody() {
        switch (this.state.body.type) {
            case RequestBodyType.urlEncoded:
                return html`<url-encoded-form></url-encoded-form>`;
            case RequestBodyType.json:
                return html`
                    <code-editor
                        .value=${this.state.body.json}
                        .wrapLines=${this.wrapLines}
                        language="json"
                        @change=${this.onJsonChange}
                    ></code-editor>
                `;
            case RequestBodyType.text:
                return html`
                    <code-editor
                        .value=${this.state.body.text}
                        .wrapLines=${this.wrapLines}
                        @change=${this.onTextChange}
                    ></code-editor>
                `;
            case RequestBodyType.file:
                return html`<file-body></file-body>`;
            default:
                return nothing;
        }
    }

    private onBodyTypeChange(event: SelectValueChangedEvent) {
        const type = event.detail.value as RequestBodyType;
        this.state.body.setType(type);
    }

    private onJsonPrettify() {
        const value = this.state.body.json.toString();
        try {
            const json = JSON.parse(value);
            const pretty = JSON.stringify(json, null, 2);
            this.state.body.setJson(Text.of(pretty.split("\n")));
        } catch (error) {
            console.error("Failed to prettify JSON", error);
        }
    }

    private onJsonMinify() {
        const value = this.state.body.json.toString();
        try {
            const json = JSON.parse(value);
            const minified = JSON.stringify(json);
            this.state.body.setJson(Text.of([minified]));
        } catch (error) {
            console.error("Failed to minify JSON", error);
        }
    }

    private onWrapLinesToggle() {
        this.wrapLines = !this.wrapLines;
    }

    private onJsonChange(event: EditorTextChangedEvent) {
        this.state.body.setJson(event.detail);
    }

    private onTextChange(event: EditorTextChangedEvent) {
        this.state.body.setText(event.detail);
    }
}
