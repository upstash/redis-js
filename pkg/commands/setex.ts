import { Command } from "./command";

/**
 * @see https://redis.io/commands/setex
 */
export class SetExCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, ttl: number, value: TData]) {
    super(["setex", ...cmd])
  }
}
