import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/flushdb
 */
export class FlushDBCommand extends Command<"OK", "OK"> {
  constructor(
    [opts]: [opts?: { async?: boolean }],
    cmdOpts?: CommandOptions<"OK", "OK">,
  ) {
    const command = ["flushdb"];
    if (opts?.async) {
      command.push("async");
    }
    super(command, cmdOpts);
  }
}
