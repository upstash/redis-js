import { NonEmptyArray } from "../types";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rpushx
 */
export class RPushXCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: NonEmptyArray<TData>]) {
    super(["rpushx", ...cmd])
  }
}
