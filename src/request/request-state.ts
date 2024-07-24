import { Text } from "@codemirror/state";
import { createContext } from "@lit/context";
import { action, makeObservable, observable } from "mobx";
import { Properties } from "../components/property-state.js";

export const requestContext = createContext<RequestState>(
    Symbol("request-context")
);

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
    url = "https://google.com";

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
