import { indentWithTab } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { codeFolding, foldGutter } from "@codemirror/language";
import { Compartment, EditorState, Text } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, queryAsync } from "lit/decorators.js";

@customElement("vin-editor")
export class VinEditor extends LitElement {
    static override styles = css`
        .cm-editor,
        .cm-editor.cm-focused {
            outline: none;
        }

        .cm-content,
        .cm-scroller {
            font-family: Consolas, "SF Mono", "Fira Code", monospace;
        }

        div.cm-content.cm-lineWrapping {
            word-break: break-all;
        }
    `;

    @property({ attribute: false })
    value = Text.empty;

    @property()
    language = "";

    @property({ type: Boolean, attribute: false })
    wrapLines = false;

    @property({ type: Boolean })
    readonly = false;

    @queryAsync("#editor-container")
    editorContainer!: Promise<HTMLElement>;

    private editorView?: EditorView;
    private lineWrapping = new Compartment();

    override connectedCallback(): void {
        super.connectedCallback();
        this.editorContainer.then((c) => this.initEditor(c));
    }

    private initEditor(parent: HTMLElement) {
        const extensions = [
            minimalSetup,
            lineNumbers(),
            codeFolding(),
            foldGutter({
                openText: "⯆",
                closedText: "⯈",
            }),
            this.lineWrapping.of(
                this.wrapLines ? [EditorView.lineWrapping] : []
            ),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.onChange(update.state.doc);
                }
            }),
            keymap.of([indentWithTab]),
        ];
        if (this.language === "json") {
            extensions.push(json());
        }
        extensions.push(EditorState.readOnly.of(this.readonly));
        this.editorView = new EditorView({
            doc: this.value,
            parent,
            extensions,
        });
    }

    protected override willUpdate(
        changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        super.willUpdate(changedProps);

        if (
            changedProps.has("value") &&
            this.editorView?.state.doc !== this.value
        ) {
            this.editorView?.dispatch({
                changes: {
                    from: 0,
                    to: this.editorView.state.doc.length,
                    insert: this.value,
                },
            });
        }

        if (changedProps.has("wrapLines")) {
            this.editorView?.dispatch({
                effects: this.lineWrapping.reconfigure(
                    this.wrapLines ? [EditorView.lineWrapping] : []
                ),
            });
        }
    }

    override render() {
        return html`<div id="editor-container"></div>`;
    }

    private onChange(newValue: Text) {
        this.dispatchEvent(new EditorTextChangedEvent(newValue));
    }

    override disconnectedCallback(): void {
        this.editorView?.destroy();
        super.disconnectedCallback();
    }
}

export class EditorTextChangedEvent extends CustomEvent<Text> {
    constructor(text: Text) {
        super("change", { detail: text });
    }
}
