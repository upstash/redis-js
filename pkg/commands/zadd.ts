import { Command, CommandOptions } from "./command";

type NXAndXXOptions =
  | { nx: true; xx?: never }
  | { nx?: never; xx: true }
  | { nx?: never; xx?: never };

type LTAndGTOptions =
  | { lt: true; gt?: never }
  | { lt?: never; gt: true }
  | { lt?: never; gt?: never };

export type ZAddCommandOptions = NXAndXXOptions &
  LTAndGTOptions & { ch?: true } & { incr?: true };

type Arg2<TData> = ScoreMember<TData> | ZAddCommandOptions;
export type ScoreMember<TData> = { score: number; member: TData };
/**
 * @see https://redis.io/commands/zadd
 */
export class ZAddCommand<TData = string> extends Command<
  number | null,
  number | null
> {
  constructor(
    [key, arg1, ...arg2]: [string, Arg2<TData>, ...ScoreMember<TData>[]],
    opts?: CommandOptions<number | null, number | null>
  ) {
    const command: unknown[] = ["zadd", key];
    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }
    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }
    if ("incr" in arg1 && arg1.incr) {
      command.push("incr");
    }

    if ("lt" in arg1 && arg1.lt) {
      command.push("lt");
    } else if ("gt" in arg1 && arg1.gt) {
      command.push("gt");
    }

    if ("score" in arg1 && "member" in arg1) {
      command.push(arg1.score, arg1.member);
    }

    command.push(...arg2.flatMap(({ score, member }) => [score, member]));

    super(command, opts);
  }
}
