import { HttpClient } from "./http"
import { UpstashResponse } from "./types"

export interface Executor<TResult> {
  exec: (client: HttpClient) => Promise<UpstashResponse<TResult>>
}
