import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/xadd
 */
export class XAddCommand extends Command<string, string> {
  constructor(
    [key, id, entries, opts]: [
      key: string,
      id: "*" | string,
      entries: { [field: string]: unknown },
      opts?: {
        nomkStream?: "*" | string;
        trim?: {
          type: "MINID" | "MAXLEN" | "minid" | "maxlen";
          comparison: "=" | "~";
          threshold: number;
          limit?: number;
        };
      }
    ],
    commandOptions?: CommandOptions<string, string>
  ) {
    const command: unknown[] = ["XADD", key];

    // opts
    if (opts) {
      if (opts.nomkStream) {
        command.push("NOMKSTREAM");
      }
      if (opts.trim) {
        command.push(opts.trim.type, opts.trim.comparison, opts.trim.threshold);
        if (typeof opts.trim.limit !== "undefined") {
          command.push("LIMIT", opts.trim.limit);
        }
      }
    }

    command.push(id);

    // entries
    Object.entries(entries).forEach(([k, v]) => {
      command.push(k, v);
    });

    super(command, commandOptions);
  }
}
