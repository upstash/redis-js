import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TData> extends Command<TData[], unknown[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sdiff", key, ...keys]);
  }
}
