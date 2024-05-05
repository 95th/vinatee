import { Text } from "@codemirror/state";
import { createContext } from "@lit/context";
import { action, makeObservable, observable } from "mobx";

export const requestContext = createContext<RequestState>(
    Symbol("request-context")
);
export const responseContext = createContext<RequestState>(
    Symbol("response-context")
);

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

export enum RequestBodyType {
    none = "None",
    text = "Text",
    json = "JSON",
    urlEncoded = "URL Encoded Form",
    file = "File",
}

export class RequestBodyState {
    @observable
    type = RequestBodyType.none;

    @observable
    json = Text.empty;

    @observable
    text = Text.empty;

    @observable
    file = "";

    @observable
    urlEncoded = new Properties();

    constructor() {
        makeObservable(this);
    }

    @action
    setType(type: RequestBodyType) {
        this.type = type;
    }

    @action
    setJson(json: Text) {
        this.json = json;
    }

    @action
    setText(text: Text) {
        this.text = text;
    }

    @action
    setFile(file: string) {
        this.file = file;
    }
}

export enum AuthorizationType {
    none = "None",
    bearer = "Bearer",
    basic = "Basic",
}

export class AuthorizationState {
    @observable
    type = AuthorizationType.none;

    @observable
    bearerToken = "";

    @observable
    basicUsername = "";

    @observable
    basicPassword = "";

    constructor() {
        makeObservable(this);
    }

    @action
    setType(type: AuthorizationType) {
        this.type = type;
    }

    @action
    setBearerToken(token: string) {
        this.bearerToken = token;
    }

    @action
    setBasicUsername(username: string) {
        this.basicUsername = username;
    }

    @action
    setBasicPassword(password: string) {
        this.basicPassword = password;
    }
}

export class RequestState {
    @observable
    method = "GET";

    @observable
    url = "";

    headers = new Properties();
    params = new Properties();
    body = new RequestBodyState();
    authorization = new AuthorizationState();

    constructor() {
        makeObservable(this);
    }

    @action
    setMethod(method: string) {
        this.method = method;
    }

    @action
    setUrl(url: string) {
        this.url = url;
    }
}

export class ResponseState {
    @observable
    status = 0;

    @observable
    body: ArrayBuffer = new ArrayBuffer(0);

    @observable
    headers = new Headers();

    @observable
    error = "";

    constructor() {
        makeObservable(this);
    }

    @action
    setResponse(status: number, headers: Headers, body: ArrayBuffer) {
        this.status = status;
        this.headers = headers;
        this.body = body;
    }

    @action
    setError(error: string) {
        this.error = error;
    }

    @action
    clear() {
        this.status = 0;
        this.body = new ArrayBuffer(0);
        this.headers = new Headers();
        this.error = "";
    }
}
