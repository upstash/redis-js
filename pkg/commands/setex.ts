import { Command } from "../command"

/**
 * @see https://redis.io/commands/setex
 */
export class SetExCommand<TData = string> extends Command<string> {
  constructor(key: string, ttl: number, value: TData) {
    super(["setex", key, ttl, value])
  }
}
