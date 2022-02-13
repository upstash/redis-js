import { HttpClient } from "./http"
import { UpstashResponse } from "./types"
import { Executor } from "./executor"

/**
 * Generic string command that gets extended by specific commands such as `get` and `set`
 */
export abstract class Command<TResult = string> implements Executor<TResult> {
  public readonly command: string[]
  constructor(command: (string | unknown)[]) {
    this.command = command.map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
  }
  public async exec(client: HttpClient): Promise<UpstashResponse<TResult>> {
    const res = await client.post<UpstashResponse<TResult>>({
      body: this.command,
    })

    try {
      /**
       * Try to parse the response if possible
       */
      const result = parseRecursive(res.result) as TResult

      return {
        ...res,
        result,
      }
    } catch {
      return res
    }
  }
}

function parseRecursive(obj: unknown): unknown {
  return Array.isArray(obj)
    ? obj.map((o) => {
        try {
          return parseRecursive(o)
        } catch {
          return o
        }
      })
    : JSON.parse(obj as string)
}
