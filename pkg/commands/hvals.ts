import { Command } from "./command";

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TData extends unknown[]> extends Command<TData, unknown[]> {
  constructor(cmd: [key: string]) {
    super(["hvals", ...cmd])
  }
}
