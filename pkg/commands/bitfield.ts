import { type Requester } from "../http";
import { Pipeline } from "../pipeline";
import { Command, type CommandOptions } from "./command";

type SubCommandArgs<TRest extends unknown[] = []> = [
  encoding: string, // u1 - u63 | i1 - i64
  offset: number | string, // <int> | #<int>
  ...TRest,
];

/**
 * @see https://redis.io/commands/bitfield
 */
class BitFieldCommandFactory {
  protected command: (string | number)[];

  constructor(cmd: [key: string]) {
    this.command = ["bitfield", ...cmd];
  }

  private chain(...args: typeof this.command): this {
    this.command.push(...args);
    return this;
  }

  get(...args: SubCommandArgs) {
    return this.chain("get", ...args);
  }

  set(...args: SubCommandArgs<[value: number]>) {
    return this.chain("set", ...args);
  }

  incrby(...args: SubCommandArgs<[increment: number]>) {
    return this.chain("incrby", ...args);
  }

  overflow(overflow: "WRAP" | "SAT" | "FAIL") {
    return this.chain("overflow", overflow);
  }
}

export class BitFieldCommand extends BitFieldCommandFactory {
  constructor(
    cmd: [key: string],
    private client: Requester,
    private opts?: CommandOptions<number[], number[]>,
  ) {
    super(cmd);
  }

  exec(): Promise<number[]> {
    return new Command(this.command, this.opts).exec(this.client);
  }
}

export class BitFieldPipeline<
  TCommands extends Command<any, any>[],
> extends BitFieldCommandFactory {
  constructor(
    cmd: [key: string],
    private pipeline: Pipeline<TCommands>,
    private opts?: CommandOptions<number[], number[]>,
  ) {
    super(cmd);
  }

  exec() {
    const command = new Command(this.command, this.opts);
    // biome-ignore lint/complexity/useLiteralKeys: chain is a private method we don't want to expose to the user
    return this.pipeline["chain"](command);
  }
}
