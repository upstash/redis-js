import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number, number> {
  constructor(
    [kv]: [kv: { [key: string]: TData }],
    opts?: CommandOptions<number, number>,
  ) {
    super(["msetnx", ...Object.entries(kv).flatMap((_) => _)], opts);
  }
}
