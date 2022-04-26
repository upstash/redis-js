import { Command } from "./command";

/**
 * @see https://redis.io/commands/get
 */
export class GetCommand<TData = string> extends Command<
  TData | null,
  unknown | null
> {
  constructor(key: string) {
    super(["get", key]);
  }
}
