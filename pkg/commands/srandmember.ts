import { Command } from "./command"
/**
 * @see https://redis.io/commands/srandmember
 */
export class SRandMemberCommand<TData> extends Command<TData | null, string | null> {
  constructor([key, count]: [key: string, count?: number]) {
    const command: unknown[] = ["srandmember", key]
    if (typeof count === "number") {
      command.push(count)
    }
    super(command)
  }
}
