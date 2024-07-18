import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/json.mset
 */
export class JsonMSetCommand<
  TData extends
    | number
    | string
    | boolean
    | Record<string, unknown>
    | (number | string | boolean | Record<string, unknown>)[]
> extends Command<"OK" | null, "OK" | null> {
  constructor(
    cmd: { key: string; path: string; value: TData }[],
    opts?: CommandOptions<"OK" | null, "OK" | null>
  ) {
    const command: unknown[] = ["JSON.MSET"];

    for (const c of cmd) {
      command.push(c.key, c.path, c.value);
    }
    super(command, opts);
  }
}
