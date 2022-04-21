import { UpstashError } from "../error";
import { Requester } from "../http";
import { parseResponse } from "../util";

type Serialize = (data: unknown) => string
type Deserialize<TResult, TData> = (result: TResult) => TData

const defaultSerializer: Serialize = (c: unknown) => (typeof c === "string" ? c : JSON.stringify(c))

export type CommandOptions<TResult = unknown, TData = unknown> = {
  serialize?: Serialize
  deserialize?: Deserialize<TResult, TData>
}
/**
 * Command offers default (de)serialization and the exec method to all commands.
 *
 * TData represents what the user will enter or receive,
 * TResult is the raw data returned from upstash, which may need to be transformed or parsed.
 */
export class Command<TData, TResult> {
  public readonly command: string[]
  public readonly serialize: Serialize
  public readonly deserialize: Deserialize<TResult, TData>
  /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(command: (string | unknown)[], opts?: CommandOptions<TResult, TData>) {
    this.serialize = opts?.serialize ?? defaultSerializer
    this.deserialize = opts?.deserialize ?? parseResponse

    this.command = command.map(this.serialize)
  }

  /**
   * Execute the command using a client.
   */
  public async exec(client: Requester): Promise<TData> {
    const { result, error } = await client.request<TResult>({
      body: this.command,
    });
    if (error) {
      throw new UpstashError(error);
    }
    if (typeof result === "undefined") {
      throw new Error(`Request did not return a result`);
    }

    return this.deserialize(result);
  }
}
