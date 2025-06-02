import { deserializeScanResponse, deserializeScanWithTypesResponse } from "../util";
import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ScanCommandOptionsStandard = {
  match?: string;
  count?: number;
  type?: string;
  withType?: false;
};

export type ScanCommandOptionsWithType = {
  match?: string;
  count?: number;
  /**
   * Includes types of each key in the result
   *
   * @example
   * ```typescript
   * await redis.scan("0", { withType: true })
   * // ["0", [{ key: "key1", type: "string" }, { key: "key2", type: "list" }]]
   * ```
   */
  withType: true;
};

export type ScanCommandOptions = ScanCommandOptionsStandard | ScanCommandOptionsWithType;

export type ScanResultStandard = [string, string[]];

export type ScanResultWithType = [string, { key: string; type: string }[]];

/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand<TData = ScanResultStandard> extends Command<[string, string[]], TData> {
  constructor(
    [cursor, opts]: [cursor: string | number, opts?: ScanCommandOptions],
    cmdOpts?: CommandOptions<[string, string[]], TData>
  ) {
    const command: (number | string)[] = ["scan", cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }

    // Handle type and withType options
    if (opts && "withType" in opts && opts.withType === true) {
      command.push("withtype");
    } else if (opts && "type" in opts && opts.type && opts.type.length > 0) {
      command.push("type", opts.type);
    }

    super(command, {
      // @ts-expect-error ignore types here
      deserialize: opts?.withType ? deserializeScanWithTypesResponse : deserializeScanResponse,
      ...cmdOpts,
    });
  }
}
