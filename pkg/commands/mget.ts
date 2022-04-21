import { Command } from "./command";
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]> extends Command<TData, (string | null)[]> {
  constructor(cmd: [...keys: [string, ...string[]]]) {
    super(["mget", ...cmd])
  }
}
