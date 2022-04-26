import { Command } from "./command.ts";
/**
 *  @see https://redis.io/commands/zrevrank
 */

export class ZRevRankCommand<TData> extends Command<
  number | null,
  number | null
> {
  constructor(key: string, member: TData) {
    super(["zrevrank", key, member]);
  }
}
