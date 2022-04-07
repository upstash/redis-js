import { Command } from "./command"

/**
 * @see https://redis.io/commands/hsetnx
 */
export class HSetNXCommand<TData> extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, field: string, value: TData]) {
    super(["hsetnx", ...cmd])
  }
}
