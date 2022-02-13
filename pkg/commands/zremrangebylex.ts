import { Command } from "../command"
/**
 * @see https://redis.io/commands/zremrangebylex
 */
export class ZRemRangeByLexCommand extends Command<number> {
  constructor(key: string, min: string, max: string) {
    super(["zremrangebylex", key, min, max])
  }
}
