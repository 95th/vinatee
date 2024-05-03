import { indentWithTab } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { codeFolding, foldGutter } from "@codemirror/language";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, queryAsync } from "lit/decorators.js";

@customElement("vin-editor")
export class VinEditor extends LitElement {
  static styles = css`
    .cm-editor,
    .cm-editor.cm-focused {
      outline: none;
    }

    .cm-content,
    .cm-scroller {
      font-family: Consolas, "SF Mono", "Fira Code", monospace;
    }
  `;

  @property()
  value = "";

  @property()
  language = "";

  @queryAsync("#editor-container")
  editorContainer!: Promise<HTMLElement>;

  private _editorView?: EditorView;

  override async connectedCallback(): Promise<void> {
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
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          this.onChange(update.state.doc.toString());
        }
      }),
      // codeFolding(),
      keymap.of([indentWithTab]),
    ];
    if (this.language === "json") {
      extensions.push(json());
    }
    this._editorView = new EditorView({ doc: this.value, parent, extensions });
  }

  protected override updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("value") &&
      this._editorView?.state.doc.length !== this.value.length
    ) {
      this._editorView?.dispatch({
        changes: {
          from: 0,
          to: this._editorView.state.doc.length,
          insert: this.value,
        },
      });
    }
  }

  override render() {
    return html`<div id="editor-container"></div>`;
  }

  onChange(newValue: string) {
    this.dispatchEvent(
      new CustomEvent<string>("change", {
        detail: newValue,
        bubbles: true,
        composed: true,
      })
    );
  }

  override disconnectedCallback(): void {
    this._editorView?.destroy();
    super.disconnectedCallback();
  }
}
