import { Command, CommandOptions } from "./command.ts";

type XGroupCommandType =
  | {
      type: "CREATE";
      group: string;
      id: `$` | string;
      options?: { MKSTREAM?: boolean; ENTRIESREAD?: number };
    }
  | {
      type: "CREATECONSUMER";
      group: string;
      consumer: string;
    }
  | {
      type: "DELCONSUMER";
      group: string;
      consumer: string;
    }
  | {
      type: "DESTROY";
      group: string;
    }
  | {
      type: "SETID";
      group: string;
      id: `$` | string;
      options?: { ENTRIESREAD?: number };
    };

type XGroupReturnType<T extends XGroupCommandType> = T["type"] extends "CREATE"
  ? string
  : T["type"] extends "CREATECONSUMER"
  ? 0 | 1
  : T["type"] extends "DELCONSUMER"
  ? number
  : T["type"] extends "DESTROY"
  ? 0 | 1
  : T["type"] extends "SETID"
  ? string
  : never;

/**
 * @see https://redis.io/commands/xgroup
 */
export class XGroupCommand<
  TOptions extends XGroupCommandType = XGroupCommandType
> extends Command<any, XGroupReturnType<TOptions>> {
  constructor(
    [key, opts]: [key: string, opts: TOptions],
    commandOptions?: CommandOptions<any, any>
  ) {
    const command: unknown[] = ["XGROUP"];

    switch (opts.type) {
      case "CREATE":
        command.push("CREATE", key, opts.group, opts.id);
        if (opts.options) {
          if (opts.options.MKSTREAM) {
            command.push("MKSTREAM");
          }
          if (opts.options.ENTRIESREAD !== undefined) {
            command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
          }
        }
        break;

      case "CREATECONSUMER":
        command.push("CREATECONSUMER", key, opts.group, opts.consumer);
        break;

      case "DELCONSUMER":
        command.push("DELCONSUMER", key, opts.group, opts.consumer);
        break;

      case "DESTROY":
        command.push("DESTROY", key, opts.group);
        break;

      case "SETID":
        command.push("SETID", key, opts.group, opts.id);
        if (opts.options && opts.options.ENTRIESREAD !== undefined) {
          command.push("ENTRIESREAD", opts.options.ENTRIESREAD.toString());
        }
        break;

      default:
        throw new Error("Invalid XGROUP");
    }
    super(command, commandOptions);
  }
}
