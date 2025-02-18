import { UpstashError } from "../error";
import type { Requester } from "../http";
import { parseResponse } from "../util";

type Serialize = (data: unknown) => string | number | boolean;
type Deserialize<TResult, TData> = (result: TResult) => TData;

const defaultSerializer: Serialize = (c: unknown) => {
  switch (typeof c) {
    case "string":
    case "number":
    case "boolean": {
      return c;
    }

    default: {
      return JSON.stringify(c);
    }
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
  latencyLogging?: boolean;
  /**
   * Additional headers to be sent with the request
   */
  headers?: Record<string, string>;

  /**
   * Path to append to the URL
   */
  path?: string[];

  onMessage?: (data: string) => void;
  isStreaming?: boolean;
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
  protected readonly headers?: Record<string, string>;
  protected readonly path?: string[];
  protected readonly onMessage?: (data: string) => void;
  protected readonly isStreaming: boolean;
  /**
   * Create a new command instance.
   *
   * You can define a custom `deserialize` function. By default we try to deserialize as json.
   */
  constructor(
    command: (string | boolean | number | unknown)[],
    opts?: CommandOptions<TResult, TData>
  ) {
    this.serialize = defaultSerializer;
    this.deserialize =
      opts?.automaticDeserialization === undefined || opts.automaticDeserialization
        ? (opts?.deserialize ?? parseResponse)
        : (x) => x as unknown as TData;

    this.command = command.map((c) => this.serialize(c));
    this.headers = opts?.headers;
    this.path = opts?.path;
    this.onMessage = opts?.onMessage;
    this.isStreaming = opts?.isStreaming ?? false;

    if (opts?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async (client: Requester): Promise<TData> => {
        const start = performance.now();
        const result = await originalExec(client);
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        // eslint-disable-next-line no-console
        console.log(
          `Latency for \u001B[38;2;19;185;39m${this.command[0]
            .toString()
            .toUpperCase()}\u001B[0m: \u001B[38;2;0;255;255m${loggerResult} ms\u001B[0m`
        );
        return result;
      };
    }
  }

  /**
   * Execute the command using a client.
   */
  public async exec(client: Requester): Promise<TData> {
    const { result, error } = await client.request<TResult>({
      body: this.command,
      path: this.path,
      upstashSyncToken: client.upstashSyncToken,
      headers: this.headers,
      onMessage: this.onMessage,
      isStreaming: this.isStreaming,
    });

    if (error) {
      throw new UpstashError(error);
    }
    if (result === undefined) {
      throw new TypeError("Request did not return a result");
    }

    return this.deserialize(result);
  }
}
