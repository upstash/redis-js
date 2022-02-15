import { Command } from "../command"

/**
 * @see https://redis.io/commands/mset
 */
export class MSetCommand<TData> extends Command<string> {
  constructor(...kvPairs: { key: string; value: TData }[]) {
    super(["mset", ...kvPairs.flatMap(({ key, value }) => [key, value])])
  }
}
