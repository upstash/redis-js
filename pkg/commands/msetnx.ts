import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number, number> {
  constructor([kv]: [kv: Record<string, TData>], opts?: CommandOptions<number, number>) {
    super(["msetnx", ...Object.entries(kv).flat()], opts);
  }
}
