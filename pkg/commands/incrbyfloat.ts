import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrbyfloat
 */
export class IncrByFloatCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: number]) {
    super(["incrbyfloat", ...cmd])
  }
}
