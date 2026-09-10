import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ArInfoOptions = {
  /**
   * Also report per-slice statistics. This walks the whole array.
   */
  full?: boolean;
};

export type ArInfoResult = {
  /** Highest occupied index plus one, as reported by `arlen`. */
  len: number;
  /** Number of occupied slots, as reported by `arcount`. */
  count: number;
  /** Number of indexes covered by one slice. */
  sliceSize: number;
  /** Number of slices currently allocated. */
  slices: number;
  /** Number of entries in the slice directory. */
  directorySize: number;
  /** Number of entries in the top-level directory. */
  superDirEntries: number;
  /** Index the next `arinsert` would write to. */
  nextInsertIndex: number;
  /** Slices stored in dense form. Only with `full`. */
  denseSlices?: number;
  /** Slices stored in sparse form. Only with `full`. */
  sparseSlices?: number;
  /** Average number of values in a dense slice. Only with `full`. */
  avgDenseSize?: number;
  /** Average fill ratio of a dense slice. Only with `full`. */
  avgDenseFill?: number;
  /** Average number of values in a sparse slice. Only with `full`. */
  avgSparseSize?: number;
};

type RawArInfo = unknown[] | Record<string, unknown>;

function toCamelCase(field: string): string {
  return field.replaceAll(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function deserializeArInfoResponse(result: RawArInfo): ArInfoResult {
  const entries: [unknown, unknown][] = Array.isArray(result)
    ? Array.from({ length: Math.floor(result.length / 2) }, (_, i) => [
        result[i * 2],
        result[i * 2 + 1],
      ])
    : Object.entries(result);

  const info: Record<string, unknown> = {};
  for (const [field, value] of entries) {
    const numeric = typeof value === "number" ? value : Number(value);
    info[toCamelCase(String(field))] = Number.isNaN(numeric) ? value : numeric;
  }
  return info as ArInfoResult;
}

/**
 * Describes how an array is laid out in memory. Throws if the key does not exist.
 *
 * @see https://upstash.com/docs/redis/commands/array/arinfo
 */
export class ArInfoCommand extends Command<RawArInfo, ArInfoResult> {
  constructor(
    [key, opts]: [key: string, opts?: ArInfoOptions],
    cmdOpts?: CommandOptions<RawArInfo, ArInfoResult>
  ) {
    const command: unknown[] = ["ARINFO", key];
    if (opts?.full) {
      command.push("FULL");
    }
    super(command, {
      deserialize: deserializeArInfoResponse,
      ...cmdOpts,
    });
  }
}
