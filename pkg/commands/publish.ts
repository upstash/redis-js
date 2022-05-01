import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/publish
 */
export class PublishCommand<TMessage = unknown> extends Command<
  number,
  number
> {
  constructor(
    cmd: [channel: string, message: TMessage],
    opts?: CommandOptions<number, number>,
  ) {
    super(["publish", ...cmd], opts);
  }
}
