import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.get
 */
export class JsonGetCommand<
  TData extends
    | (unknown | Record<string, unknown>)
    | (unknown | Record<string, unknown>)[],
> extends Command<TData | null, TData | null> {
  constructor(
    cmd:
      | [
        key: string,
        opts?: { indent?: string; newline?: string; space?: string },
        ...path: string[],
      ]
      | [key: string, ...path: string[]],
    opts?: CommandOptions<TData | null, TData | null>,
  ) {
    const command = ["JSON.GET"];
    if (typeof cmd[1] === "string") {
      // @ts-ignore - we know this is a string
      command.push(...cmd);
    } else {
      command.push(cmd[0]);

      if (cmd[1]) {
        if (cmd[1].indent) {
          command.push("INDENT", cmd[1].indent);
        }
        if (cmd[1].newline) {
          command.push("NEWLINE", cmd[1].newline);
        }
        if (cmd[1].space) {
          command.push("SPACE", cmd[1].space);
        }
      }
      // @ts-ignore - we know this is a string
      command.push(...cmd.slice(2));
    }

    super(command, opts);
  }
}
