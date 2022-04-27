import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/sinter
 */
export class SInterCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sinter", key, ...keys]);
  }
}
