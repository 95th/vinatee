export class PropertyDeleteEvent extends CustomEvent<{ index: number }> {
    constructor(index: number) {
        super("delete", {
            detail: { index },
        });
    }
}
