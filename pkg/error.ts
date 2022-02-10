/**
 * Result of a bad request to upstash
 */
export class UpstashError extends Error {
  public readonly result: string
  public readonly error: string
  public readonly status: number
  constructor(res: { result: string; error: string; status: number }) {
    super(res.error)
    this.name = "UpstashError"
    this.result = res.result
    this.error = res.error
    this.status = res.status
  }
}
