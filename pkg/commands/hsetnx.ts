import { Command } from "../command"

/**
 * @see https://redis.io/commands/hsetnx
 */
export class HSetNXCommand<TValue> extends Command<0 | 1> {
  constructor(key: string, field: string, value: TValue) {
    super(["hsetnx", key, field, value])
  }
}
