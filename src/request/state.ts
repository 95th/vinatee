import { action, makeObservable, observable } from "mobx";

export interface Property {
  name: string;
  value: string;
  enabled: boolean;
}

export class Properties {
  @observable
  entries: Property[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  add() {
    this.entries.push({ name: "", value: "", enabled: true });
  }

  @action
  delete(index: number) {
    this.entries = this.entries.filter((_, i) => i !== index);
  }

  @action
  deleteAll() {
    this.entries = [];
  }

  @action
  update(index: number, property: Partial<Property>) {
    const old = this.entries[index];
    this.entries[index] = { ...old, ...property };
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
  json = JSON.stringify({ hello: "world", foo: [1, 2, 3] });

  @observable
  text = "";

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
  setJson(json: string) {
    this.json = json;
  }

  @action
  setText(text: string) {
    this.text = text;
  }

  @action
  setFile(file: string) {
    this.file = file;
  }

  @action
  setUrlEncoded(urlEncoded: Properties) {
    this.urlEncoded = urlEncoded;
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

  @observable
  headers = new Properties();

  @observable
  params = new Properties();

  @observable
  body = new RequestBodyState();

  @observable
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
