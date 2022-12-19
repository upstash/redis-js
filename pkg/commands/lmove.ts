import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/lmove
 */
export class LMoveCommand<TData = string> extends Command<TData, TData> {
  constructor(
    cmd: [
      source: string,
      destination: string,
      whereFrom: "left" | "right",
      whereTo: "left" | "right",
    ],
    opts?: CommandOptions<TData, TData>,
  ) {
    super(["lmove", ...cmd], opts);
  }
}
