import { Command } from "../command"

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number> {
  constructor(kv: { [key: string]: TData }) {
    super(["msetnx", ...Object.entries(kv).flatMap((_) => _)])
  }
}
