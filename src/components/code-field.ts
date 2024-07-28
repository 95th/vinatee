import { EditorState, Text } from "@codemirror/state";
import { EditorView, placeholder } from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, queryAsync } from "lit/decorators.js";
import { EditorTextChangedEvent } from "./events/EditorTextChangedEvent.js";
import { highlightVariablePlugin } from "./highlightVariablePlugin.js";

@customElement("code-field")
export class CodeField extends LitElement {
    static override styles = css`
        .cm-editor,
        .cm-editor.cm-focused {
            outline: none;
            background-color: rgba(26, 57, 96, 0.1);
            border-radius: 3px;
            padding-top: 3px;
        }

        .cm-content,
        .cm-scroller {
            font-family: Consolas, "SF Mono", "Fira Code", monospace;
        }

        .cm-editor-variable {
            color: #f92672;
        }

        div.cm-content.cm-lineWrapping {
            word-break: break-all;
        }
    `;

    @property({ attribute: false })
    value = Text.empty;

    @property({ type: String })
    placeholder = "";

    @queryAsync("#editor-container")
    editorContainer!: Promise<HTMLElement>;

    private editorView?: EditorView;

    override connectedCallback(): void {
        super.connectedCallback();
        this.editorContainer.then((c) => this.initEditor(c));
    }

    private initEditor(parent: HTMLElement) {
        const extensions = [
            minimalSetup,
            highlightVariablePlugin(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.onChange(update.state.doc);
                }
            }),
            EditorState.transactionFilter.of((tr) =>
                tr.newDoc.lines > 1 ? [] : tr
            ),
        ];
        if (this.placeholder.length > 0) {
            extensions.push(placeholder(this.placeholder));
        }
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
