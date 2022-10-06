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

function base64decode(b64: string): string {
  let dec = "";
  try {
    dec = atob(b64).split("").map((c) =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join("");
  } catch (e) {
    console.warn(`Unable to decode base64 [${dec}]: ${(e as Error).message}`);

    return dec;
  }
  try {
    return decodeURIComponent(dec);
  } catch (e) {
    console.warn(`Unable to decode URI [${dec}]: ${(e as Error).message}`);
    return dec;
  }
}

function decode(raw: ResultError): ResultError {
  let result: any = undefined;
  switch (typeof raw.result) {
    case "undefined":
      return raw;

    case "number":
      result = raw.result;
      break;
    case "object":
      if (Array.isArray(raw.result)) {
        result = raw.result.map((v) =>
          typeof v === "string"
            ? base64decode(v)
            : Array.isArray(v)
            ? v.map(base64decode)
            : v
        );
      } else {
        // If it's not an array it must be null
        // Apparently null is an object in javascript
        result = null;
      }
      break;

    case "string":
      result = raw.result === "OK" ? "OK" : base64decode(raw.result);

      break;

    default:
      break;
  }

  return { result, error: raw.error };
}
