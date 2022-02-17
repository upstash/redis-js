import { Command } from "../command"

/**
 * @see https://redis.io/commands/zscan
 */
export class ZScanCommand extends Command<
  [number, (string | number)[]],
  [number, (string | number)[]]
> {
  constructor(pattern: string, cursor: number) {
    super(["zscan", pattern, cursor])
  }
}
