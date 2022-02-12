import { Command } from "../command"
/**
 * @see https://redis.io/commands/sismember
 */
export class SIsMemberCommand<TValue = string> extends Command<0 | 1> {
  constructor(key: string, member: TValue) {
    super(["sismember", key, member])
  }
}
