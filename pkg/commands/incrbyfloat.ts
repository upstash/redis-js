import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/incrbyfloat
 */
export class IncrByFloatCommand extends Command<number, number> {
  constructor(key: string, value: number) {
    super(["incrbyfloat", key, value]);
  }
}
