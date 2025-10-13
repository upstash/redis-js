import { UpstashError, UpstashJSONParseError, UrlError } from "./error";
import type { Telemetry } from "./types";
import { mergeHeaders } from "./util";

type CacheSetting =
  | "default"
  | "force-cache"
  | "no-cache"
  | "no-store"
  | "only-if-cached"
  | "reload";

export type UpstashRequest = {
  path?: string[];
  /**
   * Request body will be serialized to json
   */
  body?: unknown;

  /**
   * Additional headers for the request
   */
  headers?: Record<string, string>;

  upstashSyncToken?: string;

  /**
   * Callback for handling streaming messages
   */
  onMessage?: (data: string) => void;

  /**
   * Whether this request expects a streaming response
   */
  isStreaming?: boolean;

  /**
   * Abort signal for the request
   */
  signal?: AbortSignal;
};
export type UpstashResponse<TResult> = { result?: TResult; error?: string };

export interface Requester {
  /**
   * When this flag is enabled, any subsequent commands issued by this client are guaranteed to observe the effects of all earlier writes submitted by the same client.
   */
  readYourWrites?: boolean;

  /**
   * This token is used to ensure that the client is in sync with the server. On each request, we send this token in the header, and the server will return a new token.
   */
  upstashSyncToken?: string;
  request: <TResult = unknown>(req: UpstashRequest) => Promise<UpstashResponse<TResult>>;
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
       * A backoff function receives the current retry count and returns a number in milliseconds to wait before retrying.
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

  /**
   * Configure the cache behaviour
   * @default "no-store"
   */
  cache?: CacheSetting;
};

export type HttpClientConfig = {
  headers?: Record<string, string>;
  baseUrl: string;
  options?: Options;
  retry?: RetryConfig;
  agent?: any;
  signal?: AbortSignal | (() => AbortSignal);
  keepAlive?: boolean;

  /**
   * When this flag is enabled, any subsequent commands issued by this client are guaranteed to observe the effects of all earlier writes submitted by the same client.
   */
  readYourWrites?: boolean;
} & RequesterConfig;

export class HttpClient implements Requester {
  public baseUrl: string;
  public headers: Record<string, string>;

  public readonly options: {
    backend?: string;
    agent: any;
    signal?: HttpClientConfig["signal"];
    responseEncoding?: false | "base64";
    cache?: CacheSetting;
    keepAlive: boolean;
  };
  public readYourWrites: boolean;
  public upstashSyncToken = "";
  private hasCredentials: boolean;

  public readonly retry: {
    attempts: number;
    backoff: (retryCount: number) => number;
  };

  public constructor(config: HttpClientConfig) {
    this.options = {
      backend: config.options?.backend,
      agent: config.agent,
      responseEncoding: config.responseEncoding ?? "base64", // default to base64
      cache: config.cache,
      signal: config.signal,
      keepAlive: config.keepAlive ?? true,
    };
    this.upstashSyncToken = "";
    this.readYourWrites = config.readYourWrites ?? true;

    this.baseUrl = (config.baseUrl || "").replace(/\/$/, "");

    /**
     * regex to check if the baseUrl starts with http:// or https://
     * - `^` asserts the position at the start of the string.
     * - `[^\s/$.?#]` makes sure that the domain starts correctly;
     *   without white space, '/', '$', '.', '?' or '#'
     * - `.` matches any character except new line
     * - `[^\s]*` matches anything except white space
     * - `$` asserts the position at the end of the string.
     */
    const urlRegex = /^https?:\/\/[^\s#$./?].\S*$/;
    if (this.baseUrl && !urlRegex.test(this.baseUrl)) {
      throw new UrlError(this.baseUrl);
    }

    this.headers = {
      "Content-Type": "application/json",

      ...config.headers,
    };

    this.hasCredentials = Boolean(this.baseUrl && this.headers.authorization.split(" ")[1]);

    if (this.options.responseEncoding === "base64") {
      this.headers["Upstash-Encoding"] = "base64";
    }

    this.retry =
      typeof config.retry === "boolean" && !config.retry
        ? {
            attempts: 1,
            backoff: () => 0,
          }
        : {
            attempts: config.retry?.retries ?? 5,
            backoff: config.retry?.backoff ?? ((retryCount) => Math.exp(retryCount) * 50),
          };
  }

  public mergeTelemetry(telemetry: Telemetry): void {
    this.headers = merge(this.headers, "Upstash-Telemetry-Runtime", telemetry.runtime);
    this.headers = merge(this.headers, "Upstash-Telemetry-Platform", telemetry.platform);
    this.headers = merge(this.headers, "Upstash-Telemetry-Sdk", telemetry.sdk);
  }

  public async request<TResult>(req: UpstashRequest): Promise<UpstashResponse<TResult>> {
    const requestHeaders = mergeHeaders(this.headers, req.headers ?? {});
    const requestUrl = [this.baseUrl, ...(req.path ?? [])].join("/");
    const isEventStream = requestHeaders.Accept === "text/event-stream";

    const signal = req.signal ?? this.options.signal;
    const isSignalFunction = typeof signal === "function";

    const requestOptions: RequestInit & { backend?: string; agent?: any } = {
      //@ts-expect-error this should throw due to bun regression
      cache: this.options.cache,
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(req.body),
      keepalive: this.options.keepAlive,
      agent: this.options.agent,
      signal: isSignalFunction ? signal() : signal,

      /**
       * Fastly specific
       */
      backend: this.options.backend,
    };

    if (!this.hasCredentials) {
      console.warn(
        "[Upstash Redis] Redis client was initialized without url or token." +
          " Failed to execute command."
      );
    }

    /**
     * We've recieved a new `upstash-sync-token` in the previous response. We use it in the next request to observe the effects of previous requests.
     */
    if (this.readYourWrites) {
      const newHeader = this.upstashSyncToken;
      this.headers["upstash-sync-token"] = newHeader;
    }

    let res: Response | null = null;
    let error: Error | null = null;
    for (let i = 0; i <= this.retry.attempts; i++) {
      try {
        res = await fetch(requestUrl, requestOptions);
        break;
      } catch (error_) {
        if (requestOptions.signal?.aborted && isSignalFunction) {
          throw error_;
        } else if (requestOptions.signal?.aborted) {
          const myBlob = new Blob([
            JSON.stringify({ result: requestOptions.signal.reason ?? "Aborted" }),
          ]);
          const myOptions = {
            status: 200,
            statusText: requestOptions.signal.reason ?? "Aborted",
          };
          res = new Response(myBlob, myOptions);
          break;
        }
        error = error_ as Error;

        // Only sleep if this is not the last attempt
        if (i < this.retry.attempts) {
          await new Promise((r) => setTimeout(r, this.retry.backoff(i)));
        }
      }
    }
    if (!res) {
      throw error ?? new Error("Exhausted all retries");
    }

    if (!res.ok) {
      let body: UpstashResponse<string>;
      const rawBody = await res.text();
      try {
        body = JSON.parse(rawBody) as UpstashResponse<string>;
      } catch (error) {
        throw new UpstashJSONParseError(rawBody, { cause: error });
      }
      throw new UpstashError(`${body.error}, command was: ${JSON.stringify(req.body)}`);
    }

    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }

    if (isEventStream && req && req.onMessage && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Start reading the stream in the background
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                req.onMessage?.(data);
              }
            }
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            // Expected error during unsubscribe, ignore
          } else {
            console.error("Stream reading error:", error);
          }
        } finally {
          try {
            await reader.cancel();
          } catch {
            //ignore
          }
        }
      })();

      // Return success for streaming requests
      return { result: 1 as TResult };
    }

    let body: UpstashResponse<string>;
    const rawBody = await res.text();
    try {
      body = JSON.parse(rawBody) as UpstashResponse<string>;
    } catch (error) {
      throw new UpstashJSONParseError(rawBody, { cause: error });
    }

    /**
     * We save the new `upstash-sync-token` in the response header to use it in the next request.
     */
    if (this.readYourWrites) {
      const headers = res.headers;
      this.upstashSyncToken = headers.get("upstash-sync-token") ?? "";
    }

    if (this.options.responseEncoding === "base64") {
      if (Array.isArray(body)) {
        return body.map(({ result, error }) => ({
          result: decode(result),
          error,
        })) as UpstashResponse<TResult>;
      }
      const result = decode(body.result) as any;
      return { result, error: body.error };
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
      // eslint-disable-next-line unicorn/prefer-code-point
      bytes[i] = binString.charCodeAt(i);
    }
    dec = new TextDecoder().decode(bytes);
  } catch {
    dec = b64;
  }
  return dec;
  // try {
  //   return decodeURIComponent(dec);
  // } catch {
  //   return dec;
  // }
}

function decode(raw: ResultError["result"]): ResultError["result"] {
  let result: any = undefined;
  switch (typeof raw) {
    case "undefined": {
      return raw;
    }

    case "number": {
      result = raw;
      break;
    }
    case "object": {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (Array.isArray(raw)) {
        result = raw.map((v) =>
          typeof v === "string"
            ? base64decode(v)
            : Array.isArray(v)
              ? v.map((element) => decode(element))
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
      result = raw === "OK" ? "OK" : base64decode(raw);
      break;
    }

    default: {
      break;
    }
  }

  return result;
}

function merge(obj: Record<string, string>, key: string, value?: string): Record<string, string> {
  if (!value) {
    return obj;
  }
  obj[key] = obj[key] ? [obj[key], value].join(",") : value;
  return obj;
}
