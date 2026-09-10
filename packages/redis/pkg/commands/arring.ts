import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Appends values to a fixed-size ring of `size` slots, wrapping back to index `0` and overwriting
 * the oldest values once the ring is full. Calling it with a different `size` reshapes the ring.
 *
 * Returns the index the last value was written to.
 *
 * @see https://upstash.com/docs/redis/commands/array/arring
 */
export class ArRingCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, size: number, ...values: TData[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["ARRING", ...cmd], opts);
  }
}
