import { createContext } from "@lit/context";
import { action, makeObservable, observable } from "mobx";

export const responseContext = createContext<ResponseState>(
    Symbol("response-context")
);

export class ResponseState {
    @observable
    status = 0;

    @observable
    statusText = "";

    @observable
    body: ArrayBuffer = new ArrayBuffer(0);

    @observable
    headers = new Headers();

    @observable
    headTime = 0;

    @observable
    totalTime = 0;

    @observable
    error = "";

    constructor() {
        makeObservable(this);
    }

    @action
    setResponse(
        status: number,
        statusText: string,
        headers: Headers,
        body: ArrayBuffer,
        headTime: number,
        totalTime: number
    ) {
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.body = body;
        this.headTime = headTime;
        this.totalTime = totalTime;
    }

    @action
    setError(error: string) {
        this.error = error;
    }

    @action
    clear() {
        this.status = 0;
        this.statusText = "";
        this.body = new ArrayBuffer(0);
        this.headers = new Headers();
        this.headTime = 0;
        this.totalTime = 0;
        this.error = "";
    }
}
