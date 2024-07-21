export class PropertiesTabEvent extends CustomEvent<{ index: number }> {
    constructor(index: number) {
        super("tab", {
            detail: { index },
        });
    }
}
