import { Command, CommandOptions } from "./command";

export type ZUnionCommandOptions = {
  withScores?: boolean;
  aggregate?: "sum" | "min" | "max";
} & (
  | { weight: number; weights?: never }
  | { weight?: never; weights: number[] }
  | { weight?: never; weights?: never }
);

/**
 * @see https://redis.io/commands/zunion
 */
export class ZUnionCommand<TData extends unknown[]> extends Command<string[], TData> {
  constructor(
    cmd: [numKeys: 1, key: string, opts?: ZUnionCommandOptions],
    cmdOpts?: CommandOptions<string[], TData>
  );
  constructor(
    cmd: [numKeys: number, keys: string[], opts?: ZUnionCommandOptions],
    cmdOpts?: CommandOptions<string[], TData>
  );
  constructor(
    [numKeys, keyOrKeys, opts]: [
      numKeys: number,
      keyOrKeys: string | string[],
      opts?: ZUnionCommandOptions,
    ],
    cmdOpts?: CommandOptions<string[], TData>
  ) {
    const command: unknown[] = ["zunion", numKeys];
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys);
    } else {
      command.push(keyOrKeys);
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights);
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate);
      }
      if (opts?.withScores) {
        command.push("withscores");
      }
    }
    super(command, cmdOpts);
  }
}
