import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData> extends Command<number, number> {
  constructor(
    [key, kv]: [key: string, kv: { [field: string]: TData }],
    opts?: CommandOptions<number, number>,
  ) {
    super(
      [
        "hmset",
        key,
        ...Object.entries(kv).flatMap(([field, value]) => [field, value]),
      ],
      opts,
    );
  }
}
