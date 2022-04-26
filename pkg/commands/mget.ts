import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]> extends Command<
  TData,
  (string | null)[]
> {
  constructor(...keys: [string, ...string[]]) {
    super(["mget", ...keys]);
  }
}
