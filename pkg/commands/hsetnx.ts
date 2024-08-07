import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hsetnx
 */
export class HSetNXCommand<TData> extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, field: string, value: TData],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["hsetnx", ...cmd], opts);
  }
}
