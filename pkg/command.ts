import { HttpClient } from "./http"
import { UpstashResponse } from "./types"
import { parseResponse } from "./util"

/**
 * Generic string command that gets extended by specific commands such as `get` and `set`
 */
export abstract class Command<TResult = string> {
  public readonly command: string[]
  constructor(command: (string | unknown)[]) {
    this.command = command.map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
  }
  public async exec(client: HttpClient): Promise<TResult> {
    const res = await client.post<UpstashResponse<TResult>>({
      body: this.command,
    })
    return parseResponse(res)
  }
}
