import { Command } from "../command"
/**
 * @see https://redis.io/commands/zrem
 */
export class ZRemCommand<TData = string> extends Command<number> {
  constructor(key: string, member: TData, ...members: TData[]) {
    super(["zrem", key, member, ...members])
  }
}
