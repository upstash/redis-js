import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.set
 */
export class JsonSetCommand<
  TData extends
    | number
    | string
    | boolean
    | Record<string, unknown>
    | (number | string | boolean | Record<string, unknown>)[],
> extends Command<"OK" | null, "OK" | null> {
  constructor(
    cmd: [
      key: string,
      path: string,
      value: TData,
      opts?: { nx: true; xx?: never } | { nx?: never; xx: true },
    ],
    opts?: CommandOptions<"OK" | null, "OK" | null>,
  ) {
    const command = ["JSON.SET", cmd[0], cmd[1], cmd[2]];
    if (cmd[3]) {
      if (cmd[3].nx) {
        command.push("NX");
      } else if (cmd[3].xx) {
        command.push("XX");
      }
    }
    super(command, opts);
  }
}
