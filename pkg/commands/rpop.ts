import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rpop
 */
export class RPopCommand<TData extends unknown | unknown[] = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string, count?: number],
    opts?: CommandOptions<unknown | null, TData | null>
  ) {
    super(["rpop", ...cmd], opts);
  }
}
