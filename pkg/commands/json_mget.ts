import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.mget
 */
export class JsonMGetCommand<
  TData extends (unknown | Record<string, unknown>)[],
> extends Command<TData, TData> {
  constructor(
    cmd: [keys: string[], path: string],
    opts?: CommandOptions<TData, TData>,
  ) {
    super(["JSON.MGET", ...cmd[0], cmd[1]], opts);
  }
}
