import { Command } from "../command"

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number> {
  constructor(...kvPairs: { key: string; value: TData }[]) {
    super(["msetnx", ...kvPairs.flatMap(({ key, value }) => [key, value])])
  }
}
