import { action, makeObservable, observable } from "mobx";

export class Property {
    @observable
    name = "";

    @observable
    value = "";

    @observable
    enabled = true;

    constructor() {
        makeObservable(this);
    }

    @action
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    @action
    setName(name: string) {
        this.name = name;
    }

    @action
    setValue(value: string) {
        this.value = value;
    }
}

export class Properties {
    @observable
    entries: Property[] = [];

    constructor() {
        makeObservable(this);
    }

    @action
    add() {
        this.entries.push(new Property());
    }

    @action
    delete(index: number) {
        this.entries = this.entries.filter((_, i) => i !== index);
    }

    @action
    deleteAll() {
        this.entries = [];
    }
}
