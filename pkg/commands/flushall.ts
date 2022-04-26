import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/flushall
 */
export class FlushAllCommand extends Command<"OK", "OK"> {
  constructor(opts?: { async?: boolean }) {
    const command = ["flushall"];
    if (opts?.async) {
      command.push("async");
    }
    super(command);
  }
}
