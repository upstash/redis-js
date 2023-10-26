import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/mset
 */
export class MSetCommand<TData> extends Command<"OK", "OK"> {
  constructor([kv]: [kv: { [key: string]: TData }], opts?: CommandOptions<"OK", "OK">) {
    super(["mset", ...Object.entries(kv).flatMap(([key, value]) => [key, value])], opts);
  }
}
