import type { CommandOptions } from "./command";
import { Command } from "./command";

type XAddCommandOptions = {
  nomkStream?: boolean;
  trim?: (
    | {
        type: "MAXLEN" | "maxlen";
        threshold: number;
      }
    | {
        type: "MINID" | "minid";
        threshold: string;
      }
  ) &
    (
      | {
          comparison: "~";
          limit?: number;
        }
      | {
          comparison: "=";
          limit?: never;
        }
    );
};

/**
 * @see https://redis.io/commands/xadd
 *
 * Stream ID formats:
 * - "*" - Fully automatic ID generation
 * - "<ms>-<seq>" - Explicit ID (e.g., "1526919030474-55")
 * - "<ms>-*" - Auto-generate sequence number for the given millisecond timestamp (Redis 8+)
 */
export class XAddCommand extends Command<string, string> {
  constructor(
    [key, id, entries, opts]: [
      key: string,
      id: "*" | `${number}-*` | string,
      entries: Record<string, unknown>,
      opts?: XAddCommandOptions,
    ],
    commandOptions?: CommandOptions<string, string>
  ) {
    const command: unknown[] = ["XADD", key];

    if (opts) {
      if (opts.nomkStream) {
        command.push("NOMKSTREAM");
      }
      if (opts.trim) {
        command.push(opts.trim.type, opts.trim.comparison, opts.trim.threshold);
        if (opts.trim.limit !== undefined) {
          command.push("LIMIT", opts.trim.limit);
        }
      }
    }

    command.push(id);

    // entries
    for (const [k, v] of Object.entries(entries)) {
      command.push(k, v);
    }

    super(command, commandOptions);
  }
}
