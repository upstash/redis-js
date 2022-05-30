import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData> extends Command<"OK", "OK"> {
  constructor(
    [key, kv]: [key: string, kv: { [field: string]: TData }],
    opts?: CommandOptions<"OK", "OK">,
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
