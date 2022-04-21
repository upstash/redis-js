import { Command } from "./command";
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TData> extends Command<TData[], unknown[]> {
  constructor(cmd: [key: string, ...keys: string[]]) {
    super(["sdiff", ...cmd])
  }
}
