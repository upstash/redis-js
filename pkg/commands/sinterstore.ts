import { Command } from "./command"
/**
 * @see https://redis.io/commands/sinterstore
 */
export class SInterStoreCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(cmd: [destination: string, key: string, ...keys: string[]]) {
    super(["sinterstore", ...cmd])
  }
}
