import { Command } from "./command"
/**
 * @see https://redis.io/commands/zincrby
 */
export class ZIncrByCommand<TData> extends Command<number, number> {
  constructor(cmd: [key: string, increment: number, member: TData]) {
    super(["zincrby", ...cmd])
  }
}
