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

type ResultError = {
  result?: string | number | null | (string | number | null)[];
  error?: string;
};
export type RetryConfig =
  | false
  | {
    /**
     * The number of retries to attempt before giving up.
     *
     * @default 5
     */
    retries?: number;
    /**
     * A backoff function receives the current retry cound and returns a number in milliseconds to wait before retrying.
     *
     * @default
     * ```ts
     * Math.exp(retryCount) * 50
     * ```
     */
    backoff?: (retryCount: number) => number;
  };

type Options = {
  backend?: string;
};
export type HttpClientConfig = {
  headers?: Record<string, string>;
  baseUrl: string;
  options?: Options;
  retry?: RetryConfig;
};

export class HttpClient implements Requester {
  public baseUrl: string;
  public headers: Record<string, string>;
  public readonly options?: { backend?: string };

  public readonly retry: {
    attempts: number;
    backoff: (retryCount: number) => number;
  };

  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");

    this.headers = {
      "Content-Type": "application/json",
      "Upstash-Encoding": "base64",
      ...config.headers,
    };

    this.options = { backend: config.options?.backend };

    if (typeof config?.retry === "boolean" && config?.retry === false) {
      this.retry = {
        attempts: 1,
        backoff: () => 0,
      };
    } else {
      this.retry = {
        attempts: config?.retry?.retries ?? 5,
        backoff: config?.retry?.backoff ??
          ((retryCount) => Math.exp(retryCount) * 50),
      };
    }
  }

  public async request<TResult>(
    req: UpstashRequest,
  ): Promise<UpstashResponse<TResult>> {
    const requestOptions: RequestInit & { backend?: string } = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(req.body),
      keepalive: true,

      /**
       * Fastly specific
       */
      backend: this.options?.backend,
    };

    let res: Response | null = null;
    let error: Error | null = null;
    for (let i = 0; i <= this.retry.attempts; i++) {
      try {
        res = await fetch(
          [this.baseUrl, ...(req.path ?? [])].join("/"),
          requestOptions,
        );
        break;
      } catch (err) {
        error = err;
        await new Promise((r) => setTimeout(r, this.retry.backoff(i)));
      }
    }
    if (!res) {
      throw error ?? new Error("Exhausted all retries");
    }

    const body = (await res.json()) as UpstashResponse<string>;
    if (!res.ok) {
      throw new UpstashError(body.error!);
    }

    return Array.isArray(body) ? body.map(decode) : decode(body) as any;
  }
}

function decode(body: ResultError): ResultError {
  let decoded: any = undefined;
  switch (typeof body.result) {
    case "number":
      decoded = body.result;
      break;
    case "object":
      if (Array.isArray(body.result)) {
        decoded = body.result.map((x) => typeof x === "string" ? atob(x) : x);
      } else {
        // must be null
        decoded = null;
      }
      break;

    case "string":
      decoded = body.result === "OK" ? "OK" : atob(body.result);

      break;

    default:
      break;
  }

  let result: any;
  try {
    result = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
    if (Array.isArray(decoded) && !Array.isArray(result)) {
      result = [result] as any;
    }
  } catch {
    result = decoded;
  }

  return { result, error: body.error };
}
