import "isomorphic-fetch"
import { UpstashError } from "./error"

export type HttpRequest = {
  path?: string[]
  /**
   * Request body will be serialized to json
   */
  body?: unknown

  headers?: Record<string, string>

  retries?: number
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
  }
}

export class HttpClient {
  public baseUrl: string
  public headers: Record<string, string>
  public readonly options?: { backend?: string }

  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")

    this.headers = config.headers ?? {}

    this.options = config.options
  }

  private async request<TResponse>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    req: HttpRequest,
  ): Promise<TResponse> {
    if (!req.path) {
      req.path = []
    }
    const headers = {
      "Content-Type": "application/json",
      ...this.headers,
      ...req.headers,
    }

    // fetch is defined by isomorphic fetch
    // eslint-disable-next-line no-undef
    const res = await fetch([this.baseUrl, ...req.path].join("/"), {
      method,
      headers,
      body: JSON.stringify(req.body),
      // @ts-expect-error
      backend: this.options.backend,
    })
    const body = await res.json()
    if (!res.ok) {
      throw new UpstashError(body.error)
    }

    return body as TResponse
  }

  public async post<TResponse>(req: HttpRequest): Promise<TResponse> {
    return await this.request<TResponse>("POST", req)
  }
}
