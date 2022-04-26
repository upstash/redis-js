import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/setnx
 */
export class SetNxCommand<TData = string> extends Command<number, number> {
  constructor(key: string, value: TData) {
    super(["setnx", key, value]);
  }
}
