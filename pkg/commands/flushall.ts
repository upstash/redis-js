import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/flushall
 */
export class FlushAllCommand extends Command<"OK", "OK"> {
  constructor(args?: [{ async?: boolean }], opts?: CommandOptions<"OK", "OK">) {
    const command = ["flushall"];
    if (args && args.length > 0 && args[0].async) {
      command.push("async");
    }
    super(command, opts);
  }
}
