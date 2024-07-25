import { indentWithTab } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { codeFolding, foldGutter, syntaxTree } from "@codemirror/language";
import { Compartment, EditorState, Text } from "@codemirror/state";
import {
    Decoration,
    DecorationSet,
    EditorView,
    keymap,
    lineNumbers,
    MatchDecorator,
    placeholder,
    ViewPlugin,
    ViewUpdate,
} from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, queryAsync } from "lit/decorators.js";
import { EditorTextChangedEvent } from "./events/EditorTextChangedEvent.js";

const REGEX_VARIABLE = /(\{[a-zA-Z_][a-zA-Z0-9-_]*\})/g;

function highlightVariablePlugin() {
    const matchDecorator = new MatchDecorator({
        regexp: REGEX_VARIABLE,
        decoration: Decoration.mark({
            class: "cm-editor-variable",
        }),
    });

    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;

            constructor(view: EditorView) {
                this.decorations = matchDecorator.createDeco(view);
            }

            update(update: ViewUpdate) {
                if (
                    update.docChanged ||
                    update.viewportChanged ||
                    syntaxTree(update.startState) !== syntaxTree(update.state)
                ) {
                    this.decorations = matchDecorator.createDeco(update.view);
                }
            }
        },
        {
            decorations: (v) => v.decorations,
        }
    );
}

@customElement("code-editor")
export class CodeEditor extends LitElement {
    static override styles = css`
        .cm-editor,
        .cm-editor.cm-focused {
            outline: none;
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

    @property()
    language = "";

    @property({ type: Boolean, attribute: false })
    wrapLines = false;

    @property({ type: Boolean })
    readonly = false;

    @property({ type: Boolean })
    singleLine = false;

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
            highlightVariablePlugin(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.onChange(update.state.doc);
                }
            }),
        ];
        if (this.placeholder.length > 0) {
            extensions.push(placeholder(this.placeholder));
        }
        if (this.language === "json") {
            extensions.push(json());
        }
        if (this.singleLine) {
            extensions.push(
                EditorState.transactionFilter.of((tr) =>
                    tr.newDoc.lines > 1 ? [] : tr
                )
            );
        } else {
            extensions.push(
                lineNumbers(),
                codeFolding(),
                foldGutter({
                    openText: "⯆",
                    closedText: "⯈",
                }),
                keymap.of([indentWithTab]),
                this.lineWrapping.of(
                    this.wrapLines ? [EditorView.lineWrapping] : []
                )
            );
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
