import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number, number> {
  constructor(kv: { [key: string]: TData }) {
    super(["msetnx", ...Object.entries(kv).flatMap((_) => _)]);
  }
}
