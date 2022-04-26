import { Command } from "./command";
/**
 * @see https://redis.io/commands/sinter
 */
export class SInterCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sinter", key, ...keys]);
  }
}
