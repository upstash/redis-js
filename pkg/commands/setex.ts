import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/setex
 */
export class SetExCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, ttl: number, value: TData], opts?: CommandOptions<"OK", "OK">) {
    super(["setex", ...cmd], opts);
  }
}
