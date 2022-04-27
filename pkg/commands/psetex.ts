import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/psetex
 */
export class PSetEXCommand<TData = string> extends Command<string, string> {
  constructor(key: string, ttl: number, value: TData) {
    super(["psetex", key, ttl, value]);
  }
}
