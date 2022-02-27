import { UpstashError } from "../dist"
import { HttpClient } from "./http"
import { UpstashResponse } from "./types"
import { parseResponse } from "./util"

/**
 * Command offers default (de)serialization and the exec method to all commands.
 *
 * TData represents what the user will enter or receive,
 * TResult is the raw data returned from upstash, which may need to be transformed or parsed.
 */
export abstract class Command<TData, TResult> {
  public readonly command: string[]
  public deserialize: (result: TResult) => TData
  /**
   * Create a new command instance.
   * 
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(command: (string | unknown)[], opts?: { deserialize?: (result: TResult) => TData }) {
    this.command = command.map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
    this.deserialize = opts?.deserialize ?? parseResponse
  }

  /**
   * Execute the command using a client.
   */
  public async exec(client: HttpClient): Promise<TData> {
    const { result, error } = await client.post<UpstashResponse<TResult>>({
      body: this.command,
    })
    if (error) {
      throw new UpstashError(error)
    }
    if (typeof result === "undefined") {
      throw new Error(`Request did not return a result`)
    }

    return this.deserialize(result)
  }
}
