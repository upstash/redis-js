import { DEFAULT_HEADERS } from "./lib/constants";
import { ClientOptions } from "./lib/types";
import axios, { AxiosError, AxiosInstance } from "axios";

export default class Client {
  protected api: AxiosInstance;

  constructor(
    protected upstashUrl: string,
    protected upstashToken: string,
    headers?: ClientOptions
  ) {
    if (!upstashUrl) throw new Error("upstashUrl is required.");
    if (!upstashToken) throw new Error("upstashToken is required.");

    this.api = axios.create({
      baseURL: this.upstashUrl,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
        Authorization: `Bearer ${upstashToken}`,
      },
    });
  }

  protected async asd(cb: Function) {
    let data: any = null;
    let error: AxiosError | string | null = null;
    let status: number | null = null;

    try {
      const res = await cb();
      data = res.data;
      status = res.status;
    } catch (e) {
      if (!e.isAxiosError) error = e;
      status = e.response.status;
      error = e.response.data.error;
    }

    return { data, error, status };
  }

  async get(key: string) {
    return this.asd(() => this.api.get(`/get/${key}`));
  }
}
