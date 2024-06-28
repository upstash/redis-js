import { type Requester } from "../http";
import { Command, type CommandOptions } from "./command";

type SubcommandArgs<Rest extends unknown[] = []> = [
  encoding: `u${number}` | `i${number}`, // u1 - u63 | i1 - i64
  offset: number | `#${number}`, // any int
  ...Rest,
];

/**
 * Returns an instance that can be used to execute `BITFIELD` commands on one key.
 *
 * @see https://redis.io/commands/bitfield
 */
export class BitFieldCommand extends Command<number[], number[]> {
  constructor(
    cmd: [key: string],
    opts?: CommandOptions<number[], number[]>,
    private client?: Requester,
  ) {
    super(cmd, opts);
  }

  private pushSerializedArgs(...args: unknown[]) {
    return this.command.push(...args.map((arg) => this.serialize(arg)));
  }

  get(...args: SubcommandArgs): this {
    this.pushSerializedArgs("get", ...args);
    return this;
  }

  set(...args: SubcommandArgs<[value: number]>): this {
    this.pushSerializedArgs("set", ...args);
    return this;
  }

  incrby(...args: SubcommandArgs<[increment: number]>): this {
    this.pushSerializedArgs("incrby", ...args);
    return this;
  }

  overflow(overflow: "WRAP" | "SAT" | "FAIL"): this {
    this.pushSerializedArgs("overflow", overflow);
    return this;
  }

  override exec(client = this.client): Promise<number[]> {
    return this.exec(client);
  }
}
