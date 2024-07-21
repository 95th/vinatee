import { Text } from "@codemirror/state";

export class EditorTextChangedEvent extends CustomEvent<Text> {
    constructor(text: Text) {
        super("change", { detail: text });
    }
}
