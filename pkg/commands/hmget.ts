import { Command } from "../command"

/**
 * @see https://redis.io/commands/hmget
 */
export class HMGetCommand<TDatas extends unknown[]> extends Command<TDatas> {
  constructor(key: string, ...fields: string[]) {
    super(["hmget", key, ...fields])
  }
}
