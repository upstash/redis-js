import { Command } from "./command";

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData> extends Command<number, number> {
  constructor(key: string, kv: { [field: string]: TData }) {
    super([
      "hmset",
      key,
      ...Object.entries(kv).flatMap(([field, value]) => [field, value]),
    ]);
  }
}
