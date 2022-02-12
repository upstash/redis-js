import { Command } from "../command"

/**
 * @see https://redis.io/commands/sadd
 */
export class SAddCommand<TValue = string> extends Command<number> {
  constructor(key: string, member: TValue, ...members: TValue[]) {
    super(["sadd", key, member, ...members])
  }
}
