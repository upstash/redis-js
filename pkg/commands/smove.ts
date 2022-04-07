import { Command } from "./command"
/**
 * @see https://redis.io/commands/smove
 */
export class SMoveCommand<TData> extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [source: string, destination: string, member: TData]) {
    super(["smove", ...cmd])
  }
}
