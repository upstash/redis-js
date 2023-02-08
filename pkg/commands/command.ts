import { UpstashError } from "../error.ts";
import { Requester } from "../http.ts";
import { parseResponse } from "../util.ts";

type Serialize = (data: unknown) => string | number | boolean;
type Deserialize<TResult, TData> = (result: TResult) => TData;

const defaultSerializer: Serialize = (c: unknown) => {
  switch (typeof c) {
    case "string":
    case "number":
    case "boolean":
      return c;

    default:
      return JSON.stringify(c);
  }
};

export type CommandOptions<TResult, TData> = {
  /**
   * Custom deserializer
   */
  deserialize?: (result: TResult) => TData;
  /**
   * Automatically try to deserialize the returned data from upstash using `JSON.deserialize`
   *
   * @default true
   */
  automaticDeserialization?: boolean;
};
/**
 * Command offers default (de)serialization and the exec method to all commands.
 *
 * TData represents what the user will enter or receive,
 * TResult is the raw data returned from upstash, which may need to be transformed or parsed.
 */
export class Command<TResult, TData> {
  public readonly command: (string | number | boolean)[];
  public readonly serialize: Serialize;
  public readonly deserialize: Deserialize<TResult, TData>;
  /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(
    command: (string | boolean | number | unknown)[],
    opts?: CommandOptions<TResult, TData>,
  ) {
    this.serialize = defaultSerializer;
    this.deserialize = typeof opts?.automaticDeserialization === "undefined" ||
        opts.automaticDeserialization
      ? opts?.deserialize ?? parseResponse
      : (x) => x as unknown as TData;

    this.command = command.map((c) => this.serialize(c));
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
      throw new Error("Request did not return a result");
    }

    return this.deserialize(result);
  }
}
