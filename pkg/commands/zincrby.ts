import { Command } from "../command"
/**
 * @see https://redis.io/commands/zincrby
 */
export class ZIncrByComand<TData> extends Command<number, number> {
  constructor(key: string, increment: number, member: TData) {
    super(["zincrby", key, increment, member])
  }
}
