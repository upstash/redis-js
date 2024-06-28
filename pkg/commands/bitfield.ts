import { type Requester } from "../http";
import { Command, type CommandOptions } from "./command";

type SubcommandArgs<Rest extends unknown[] = []> = [
  encoding: string, // u1 - u63 | i1 - i64
  offset: number | string, // #<int> | <int>
  ...Rest,
];

/**
 * @see https://redis.io/commands/bitfield
 */
export class BitFieldCommand extends Command<number[], number[]> {  
  constructor(
    cmd: [key: string],
    private client: Requester,
    opts?: CommandOptions<number[], number[]>,
  ) {
    super(["bitfield", ...cmd], opts);
  }

  private chain(...args: typeof this.command): this {
    this.command.push(...args);
    return this;
  }

  get(...args: SubcommandArgs) {
    return this.chain("get", ...args);
  }

  set(...args: SubcommandArgs<[value: number]>) {
    return this.chain("set", ...args);
  }

  incrby(...args: SubcommandArgs<[increment: number]>) {
    return this.chain("incrby", ...args);
  }

  overflow(overflow: "WRAP" | "SAT" | "FAIL") {
    return this.chain("overflow", overflow);
  }

  override exec(): Promise<number[]> {
    return super.exec(this.client);
  }
}
