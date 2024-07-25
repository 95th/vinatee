import { syntaxTree } from "@codemirror/language";
import {
    Decoration,
    DecorationSet,
    EditorView,
    MatchDecorator,
    ViewPlugin,
    ViewUpdate,
} from "@codemirror/view";

const REGEX_VARIABLE = /(\{[a-zA-Z_][a-zA-Z0-9-_]*\})/g;

export function highlightVariablePlugin() {
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
