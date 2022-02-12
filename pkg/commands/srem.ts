import { Command } from "../command"
/**
 * @see https://redis.io/commands/srem
 */
export class SRemCommand<TValue = string> extends Command<number> {
  constructor(key: string, member: TValue, ...members: TValue[]) {
    super(["srem", key, member, ...members])
  }
}
