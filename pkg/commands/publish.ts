import { Command } from "./command"

/**
 * @see https://redis.io/commands/publish
 */
export class PublishCommand extends Command<number, number> {
  constructor(channel: string, message: string) {
    super(["publish", channel, message])
  }
}
