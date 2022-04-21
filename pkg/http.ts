import https from "https"
import http from "http"
import { UpstashError } from "./error"

export type HttpRequest = {
  path?: string[]
  /**
   * Request body will be serialized to json
   */
  body?: unknown
}

export type UpstashResponse<TResult> = {
  result?: TResult
  error?: string
}

export type HttpClientConfig = {
  headers?: Record<string, string>
  baseUrl: string
  options?: {
    backend?: string
    agent?: https.Agent | http.Agent
  }
}

export class HttpClient {
  public baseUrl: string
  public headers: Record<string, string>

  public readonly options?: { backend?: string; agent?: any }

  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")

    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    }

    this.options = config.options
  }

  public async request<TResponse>(req: HttpRequest): Promise<TResponse> {
    if (!req.path) {
      req.path = []
    }

    // fetch is defined by isomorphic fetch or by the runtime
    // eslint-disable-next-line no-undef
    const res = await fetch([this.baseUrl, ...req.path].join("/"), {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(req.body),
      // @ts-expect-error
      backend: this.options?.backend,

      /**
       * This option only works in the browser
       */
      keepalive: true,

      /**
       * Setting `keepAlive` using `agent` works in nodejs
       */
      agent: this.options?.agent,
    })
    const body = await res.json()
    if (!res.ok) {
      throw new UpstashError(body.error)
    }

    return body as TResponse
  }
}
