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
type ErrorResponse = { result: string; error: string; status: number }

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

    let err = new Error()
    for (let attempt = 0; attempt <= (req.retries ?? 5); attempt++) {
      if (attempt > 0) {
        // 0.25s up to 8s timeouts
        await new Promise((r) => setTimeout(r, 2 ** attempt * 250))
      }

      try {
        // fetch is defined by isomorphic fetch
        // eslint-disable-next-line no-undef
        const res = await fetch([this.baseUrl, ...req.path].join("/"), {
          method,
          headers,
          body: JSON.stringify(req.body),
        })

        const body = await res.json()
        if (!res.ok) {
          throw new UpstashError(body as ErrorResponse)
        }

        return body as TResponse
      } catch (e) {
        err = e as Error
      }
    }
    throw err
  }

  public async get<TResponse>(req: Request): Promise<TResponse> {
    return await this.request<TResponse>("GET", req)
  }

  public async post<TResponse>(req: Request): Promise<TResponse> {
    return await this.request<TResponse>("POST", req)
  }
}
