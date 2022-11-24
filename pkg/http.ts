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

export type Options = {
  backend?: string;
};

export type RequesterConfig = {
  /**
   * Configure the retry behaviour in case of network errors
   */
  retry?: RetryConfig;

  /**
   * Due to the nature of dynamic and custom data, it is possible to write data to redis that is not
   * valid json and will therefore cause errors when deserializing. This used to happen very
   * frequently with non-utf8 data, such as emojis.
   *
   * By default we will therefore encode the data as base64 on the server, before sending it to the
   * client. The client will then decode the base64 data and parse it as utf8.
   *
   * For very large entries, this can add a few milliseconds, so if you are sure that your data is
   * valid utf8, you can disable this behaviour by setting this option to false.
   *
   * Here's what the response body looks like:
   *
   * ```json
   * {
   *  result?: "base64-encoded",
   *  error?: string
   * }
   * ```
   *
   * @default "base64"
   */
  responseEncoding?: false | "base64";
};

export type HttpClientConfig = {
  headers?: Record<string, string>;
  baseUrl: string;
  options?: Options;
  retry?: RetryConfig;
  agent?: any;
  telemetry?: {
    /**
     * Upstash-Telemetry-Sdk
     * @example @upstash/redis@v1.1.1
     */
    sdk?: string;

    /**
     * Upstash-Telemetry-Platform
     * @example cloudflare
     */
    platform?: string;

    /**
     * Upstash-Telemetry-Runtime
     * @example node@v18
     */
    runtime?: string;
  };
} & RequesterConfig;

export class HttpClient implements Requester {
  public baseUrl: string;
  public headers: Record<string, string>;
  public readonly options: {
    backend?: string;
    agent: any;
    responseEncoding?: false | "base64";
  };

  public readonly retry: {
    attempts: number;
    backoff: (retryCount: number) => number;
  };

  public constructor(config: HttpClientConfig) {
    this.options = {
      backend: config.options?.backend,
      agent: config.agent,
      responseEncoding: config.responseEncoding ?? "base64", // default to base64
    };

    this.baseUrl = config.baseUrl.replace(/\/$/, "");

    this.headers = {
      "Content-Type": "application/json",

      ...config.headers,
    };
    if (config.telemetry?.runtime) {
      this.headers["Upstash-Telemetry-Runtime"] = config.telemetry.runtime;
    }
    if (config.telemetry?.platform) {
      this.headers["Upstash-Telemetry-Platform"] = config.telemetry.platform;
    }
    if (config.telemetry?.sdk) {
      this.headers["Upstash-Telemetry-Sdk"] = config.telemetry.sdk;
    }

    if (this.options.responseEncoding === "base64") {
      this.headers["Upstash-Encoding"] = "base64";
    }

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
    const requestOptions: RequestInit & { backend?: string; agent?: any } = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(req.body),
      keepalive: true,
      agent: this.options?.agent,

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

    if (this.options?.responseEncoding === "base64") {
      return Array.isArray(body) ? body.map(decode) : decode(body) as any;
    }
    return body as UpstashResponse<TResult>;
  }
}

function base64decode(b64: string): string {
  let dec = "";
  try {
    /**
     * Using only atob() is not enough because it doesn't work with unicode characters
     */
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    dec = new TextDecoder().decode(bytes);
  } catch {
    dec = b64;
  }
  try {
    return decodeURIComponent(dec);
  } catch {
    return dec;
  }
}

function decode(raw: ResultError): ResultError {
  let result: any = undefined;
  switch (typeof raw.result) {
    case "undefined":
      return raw;

    case "number": {
      result = raw.result;
      break;
    }
    case "object": {
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
    }

    case "string": {
      result = raw.result === "OK" ? "OK" : base64decode(raw.result);
      break;
    }

    default:
      break;
  }

  return { result, error: raw.error };
}
