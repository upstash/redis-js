import "isomorphic-fetch"
import { UpstashError } from "./error"

export type Request = {
  path?: string[]
  /**
   * Request body will be serialized to json
   */
  body?: unknown

  headers?: Record<string, string>

  retries?: number
}

export type HttpClientConfig = {
  headers?: Record<string, string>
  baseUrl: string
}

export class HttpClient {
  public baseUrl: string
  public headers: Record<string, string>

  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")

    this.headers = config.headers ?? {}
  }

  private async request<TResponse>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    req: Request,
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
    })

    const body = await res.json()
    if (!res.ok) {
      throw new UpstashError(body.error)
    }

    return body as TResponse
  }

  public async post<TResponse>(req: Request): Promise<TResponse> {
    return await this.request<TResponse>("POST", req)
  }
}
