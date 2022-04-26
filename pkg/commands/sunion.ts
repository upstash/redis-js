import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/sunion
 */
export class SUnionCommand<TData> extends Command<TData[], string[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sunion", key, ...keys]);
  }
}
