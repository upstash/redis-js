import { Command } from "./command"
import { Executor } from "./executor"
import { HttpClient } from "./http"
import { UpstashResponse } from "./types"
import {
  AppendCommand,
  DecrCommand,
  GetCommand,
  DecrByCommand,
  SetNxCommand,
  SetExCommand,
  MSetCommand,
  MGetCommand,
  SetCommand,
  StrLenCommand,
  IncrByCommand,
  GetSetCommand,
  SetCommandOptions,
  IncrCommand,
  IncrByFloatCommand,
  SetRangeCommand,
  GetRangeCommand,
  MSetNXCommand,
  PSetEXCommand,
} from "./commands/strings"
/**
 * Pipelines allow you to chain commands together and save roundtrips to upstash.
 */
export class Pipeline<TCommandResults extends unknown[] = unknown[]>
  implements Executor<TCommandResults>
{
  private client: HttpClient
  private readonly commands: Command<unknown>[]

  constructor(client: HttpClient) {
    this.client = client

    this.commands = []
  }

  public async exec(): Promise<UpstashResponse<TCommandResults>> {
    const res = await this.client.post<UpstashResponse<TCommandResults>>({
      path: ["pipeline"],
      body: Object.values(this.commands).map((c) => c.command),
    })
    if (res.error) {
      return res
    }
    try {
      /**
       * Try to parse the response if possible
       */
      const result = res.result?.map((r) => JSON.parse(r as string)) as TCommandResults

      return {
        ...res,
        result,
      }
    } catch {
      return res
    }
  }

  /**
   * Pushes a command into the pipelien and returns a chainable instance of the
   * pipeline
   */
  private chain<T>(command: Command<T>): this {
    this.commands.push(command)
    return this
  }

  public append(key: string, value: string): this {
    return this.chain(new AppendCommand(key, value))
  }

  public decr(key: string): this {
    return this.chain(new DecrCommand(key))
  }

  public decrby(key: string, value: number): this {
    return this.chain(new DecrByCommand(key, value))
  }

  public get(key: string): this {
    return this.chain(new GetCommand(key))
  }

  public getrange(key: string, start: number, end: number): this {
    return this.chain(new GetRangeCommand(key, start, end))
  }

  public getset<TData>(key: string, value: TData): this {
    return this.chain(new GetSetCommand<TData>(key, value))
  }

  public incr(key: string): this {
    return this.chain(new IncrCommand(key))
  }

  public incrby(key: string, value: number): this {
    return this.chain(new IncrByCommand(key, value))
  }

  public incrbyfloat(key: string, value: number): this {
    return this.chain(new IncrByFloatCommand(key, value))
  }

  public mget<TData>(...keys: string[]): this {
    return this.chain(new MGetCommand<TData>(...keys))
  }

  public mset<TData>(...kv: { key: string; value: TData }[]): this {
    return this.chain(new MSetCommand<TData>(...kv))
  }

  public msetnx<TData>(...kv: { key: string; value: TData }[]): this {
    return this.chain(new MSetNXCommand<TData>(...kv))
  }
  public psetex<TData>(key: string, ttl: number, value: TData): this {
    return this.chain(new PSetEXCommand<TData>(key, ttl, value))
  }

  public set<TData, TResult = string>(key: string, value: TData, opts?: SetCommandOptions): this {
    return this.chain(new SetCommand<TData, TResult>(key, value, opts))
  }

  public setex<TData>(key: string, ttl: number, value: TData): this {
    return this.chain(new SetExCommand<TData>(key, ttl, value))
  }

  public setnx<TData>(key: string, value: TData): this {
    return this.chain(new SetNxCommand<TData>(key, value))
  }

  public setrange(key: string, offset: number, value: string): this {
    return this.chain(new SetRangeCommand(key, offset, value))
  }

  public strlen(key: string): this {
    return this.chain(new StrLenCommand(key))
  }
}
