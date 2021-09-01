import fetch from "isomorphic-unfetch";

export default class Client {
  private url: string | null;
  private token: string | null;

  // constructor(protected url: string, protected token: string) {}

  constructor(url?: string, token?: string) {
    this.url = url ?? process.env.UPSTASH_URL ?? null;
    this.token = token ?? process.env.UPSTASH_TOKEN ?? null;
  }

  public async auth(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  private async generator(...parts: (string | number | boolean)[]) {
    const url = `${this.url}/${parts.join("/")}`;
    console.log(url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then((res) => res.json());

    if (response.error) {
      return {
        data: undefined,
        error: response.error,
        status: response.status,
      };
    }

    return { data: response.result, error: undefined };
  }

  public async set(key: string, value: string) {
    return this.generator("set", key, value);
  }

  public async get(key: string) {
    return this.generator("get", key);
  }
}
