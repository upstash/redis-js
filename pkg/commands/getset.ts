import { Command } from "../command"

/**
 * @see https://redis.io/commands/getset
 */
export class GetSetCommand<TData = string> extends Command<TData> {
  constructor(key: string, value: TData) {
    super(["getset", key, value])
  }
}
