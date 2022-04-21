import { Command } from "./command";
/**
 * @see https://redis.io/commands/sismember
 */
export class SIsMemberCommand<TData = string> extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, member: TData]) {
    super(["sismember", ...cmd])
  }
}
