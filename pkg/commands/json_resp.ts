import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.resp
 */
export class JsonRespCommand<TData extends unknown[]>
  extends Command<TData, TData> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<TData, TData>,
  ) {
    super(["JSON.RESP", ...cmd], opts);
  }
}
