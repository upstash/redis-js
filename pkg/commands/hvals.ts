import { Command } from "../command"

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TDatas extends unknown[]> extends Command<TDatas> {
  constructor(key: string) {
    super(["hvals", key])
  }
}
