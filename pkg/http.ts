import { UpstashError } from "./error.ts";

export type UpstashRequest = {
  path?: string[];
  /**
   * Request body will be serialized to json
   */
  body?: unknown;
};
export type UpstashResponse<TResult> = { result?: TResult; error?: string };

export interface Requester {
  request: <TResult = unknown>(
    req: UpstashRequest,
  ) => Promise<UpstashResponse<TResult>>;
}
export type HttpClientConfig = {
  headers?: Record<string, string>;
  baseUrl: string;
  options?: { backend?: string };
};

export class HttpClient implements Requester {
  public baseUrl: string;
  public headers: Record<string, string>;
  public readonly options?: { backend?: string };

  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");

    this.headers = { "Content-Type": "application/json", ...config.headers };

    this.options = config.options;
  }

  public async request<TResult>(
    req: UpstashRequest,
  ): Promise<UpstashResponse<TResult>> {
    if (!req.path) {
      req.path = [];
    }

    // fetch is defined by isomorphic fetch
    // eslint-disable-next-line no-undef
    const res = await fetch([this.baseUrl, ...req.path].join("/"), {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(req.body),
      // @ts-assertEquals-error
      // backend: this.options?.backend,
    });
    const body = (await res.json()) as UpstashResponse<TResult>;
    if (!res.ok) {
      throw new UpstashError(body.error!);
    }

    return body;
  }
}
