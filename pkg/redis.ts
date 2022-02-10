import { HttpClient } from "./http"
import { UpstashResponse } from "./types"
import {
  AppendCommand,
  DecrByCommand,
  DecrCommand,
  GetCommand,
  GetRangeCommand,
  GetSetCommand,
  IncrByCommand,
  IncrByFloatCommand,
  IncrCommand,
  MGetCommand,
  MSetCommand,
  MSetNXCommand,
  PSetEXCommand,
  SetCommand,
  SetCommandOptions,
  SetExCommand,
  SetNxCommand,
  SetRangeCommand,
  StrLenCommand,
} from "./commands/strings"
import { Pipeline } from "./pipeline"
/**
 * Connection credentials for upstash redis.
 * Get them from https://console.upstash.com/redis/<uuid>
 */
export type RedisConfig = {
  /**
   * UPSTASH_REDIS_REST_URL
   */
  url: string

  /**
   * UPSTASH_REDIS_REST_TOKEN
   */
  token: string
}

/**
 * Serverless redis client for upstash.
 */
export class Redis {
  private readonly client: HttpClient

  /**
   * Create a new redis client
   *
   * @example
   * ```typescript
   * const redis = new Redis({
   *  url: "<UPSTASH_REDIS_REST_URL>",
   *  token: "<UPSTASH_REDIS_REST_TOKEN>",
   * });
   * ```
   */
  constructor(config: RedisConfig) {
    this.client = new HttpClient({
      baseUrl: config.url,
      headers: {
        authorization: `Bearer ${config.token}`,
      },
    })
  }

  public pipeline<TResult extends unknown[]>(): Pipeline<TResult> {
    return new Pipeline(this.client)
  }

  public async append(key: string, value: string): Promise<UpstashResponse<number>> {
    return new AppendCommand(key, value).exec(this.client)
  }

  public async decr(key: string): Promise<UpstashResponse<number>> {
    return new DecrCommand(key).exec(this.client)
  }

  public async decrby(key: string, value: number): Promise<UpstashResponse<number>> {
    return new DecrByCommand(key, value).exec(this.client)
  }

  public async get(key: string): Promise<UpstashResponse<string>> {
    return new GetCommand(key).exec(this.client)
  }

  public getrange(key: string, start: number, end: number): Promise<UpstashResponse<string>> {
    return new GetRangeCommand(key, start, end).exec(this.client)
  }
  public getset<TData = string>(key: string, value: TData): Promise<UpstashResponse<TData>> {
    return new GetSetCommand<TData>(key, value).exec(this.client)
  }

  public incr(key: string): Promise<UpstashResponse<number>> {
    return new IncrCommand(key).exec(this.client)
  }

  public incrby(key: string, value: number): Promise<UpstashResponse<number>> {
    return new IncrByCommand(key, value).exec(this.client)
  }

  public incrbyfloat(key: string, value: number): Promise<UpstashResponse<number>> {
    return new IncrByFloatCommand(key, value).exec(this.client)
  }

  public mget<TData>(...keys: string[]): Promise<UpstashResponse<TData[]>> {
    return new MGetCommand<TData>(...keys).exec(this.client)
  }

  public mset<TData>(...kv: { key: string; value: TData }[]): Promise<UpstashResponse<string>> {
    return new MSetCommand<TData>(...kv).exec(this.client)
  }

  public msetnx<TData>(...kv: { key: string; value: TData }[]): Promise<UpstashResponse<number>> {
    return new MSetNXCommand<TData>(...kv).exec(this.client)
  }
  public psetex<TData>(key: string, ttl: number, value: TData): Promise<UpstashResponse<string>> {
    return new PSetEXCommand<TData>(key, ttl, value).exec(this.client)
  }

  public set<TData, TResult = string>(
    key: string,
    value: TData,
    opts?: SetCommandOptions,
  ): Promise<UpstashResponse<TResult>> {
    return new SetCommand<TData, TResult>(key, value, opts).exec(this.client)
  }

  public setex<TData>(key: string, ttl: number, value: TData): Promise<UpstashResponse<string>> {
    return new SetExCommand<TData>(key, ttl, value).exec(this.client)
  }

  public setnx<TData>(key: string, value: TData): Promise<UpstashResponse<number>> {
    return new SetNxCommand<TData>(key, value).exec(this.client)
  }

  public setrange(key: string, offset: number, value: string): Promise<UpstashResponse<number>> {
    return new SetRangeCommand(key, offset, value).exec(this.client)
  }

  public strlen(key: string): Promise<UpstashResponse<number>> {
    return new StrLenCommand(key).exec(this.client)
  }
}
