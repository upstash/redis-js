export type UpstashResponse<TResult> = {
  result?: TResult
  error?: string
}

export type PipelineResponse<T> = UpstashResponse<T[]>
