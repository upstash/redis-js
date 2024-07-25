import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/flushdb
 */
export class FlushDBCommand extends Command<"OK", "OK"> {
  constructor([opts]: [opts?: { async?: boolean }], cmdOpts?: CommandOptions<"OK", "OK">) {
    const command = ["flushdb"];
    if (opts?.async) {
      command.push("async");
    }
    super(command, cmdOpts);
  }
}
