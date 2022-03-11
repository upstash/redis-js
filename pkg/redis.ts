import { HttpClient } from "./http"
import type { CommandArgs, NonEmptyArray } from "./types"
import {
  AppendCommand,
  BitCountCommand,
  BitOpCommand,
  BitPosCommand,
  DBSizeCommand,
  DecrByCommand,
  DecrCommand,
  DelCommand,
  EchoCommand,
  ExistsCommand,
  ExpireAtCommand,
  ExpireCommand,
  FlushAllCommand,
  FlushDBCommand,
  GetBitCommand,
  GetCommand,
  GetRangeCommand,
  GetSetCommand,
  HDelCommand,
  HExistsCommand,
  HGetAllCommand,
  HGetCommand,
  HIncrByCommand,
  HIncrByFloatCommand,
  HKeysCommand,
  HLenCommand,
  HMGetCommand,
  HMSetCommand,
  HScanCommand,
  HSetCommand,
  HSetNXCommand,
  HStrLenCommand,
  HValsCommand,
  IncrByCommand,
  IncrCommand,
  KeysCommand,
  LIndexCommand,
  LInsertCommand,
  LLenCommand,
  LPopCommand,
  LPushCommand,
  LPushXCommand,
  LRangeCommand,
  LRemCommand,
  LSetCommand,
  LTrimCommand,
  MGetCommand,
  MSetCommand,
  MSetNXCommand,
  PersistCommand,
  PExpireAtCommand,
  PExpireCommand,
  PingCommand,
  PSetEXCommand,
  PTtlCommand,
  RandomKeyCommand,
  RenameCommand,
  RenameNXCommand,
  RPopCommand,
  RPushCommand,
  RPushXCommand,
  SAddCommand,
  ScanCommand,
  SCardCommand,
  SDiffCommand,
  SDiffStoreCommand,
  SetBitCommand,
  SetCommand,
  SetExCommand,
  SetNxCommand,
  SetRangeCommand,
  SInterCommand,
  SIsMemberCommand,
  SMembersCommand,
  SMoveCommand,
  SPopCommand,
  SRemCommand,
  SScanCommand,
  StrLenCommand,
  SUnionCommand,
  TimeCommand,
  TouchCommand,
  TtlCommand,
  TypeCommand,
  UnlinkCommand,
  ZAddCommand,
  ZCardCommand,
  ZCountCommand,
  ZIncrByComand,
  ZLexCountCommand,
  ZPopMaxCommand,
  ZPopMinCommand,
  ZRangeCommand,
  ZRankCommand,
  ZRemCommand,
  ZRemRangeByLexCommand,
  ZRemRangeByRankCommand,
  ZRevRankCommand,
  ZScanCommand,
  ZScoreCommand,
  SetCommandOptions,
  ScoreMember,
  ZAddCommandOptions,
  ZAddCommandOptionsWithIncr,
  IncrByFloatCommand,
  SInterStoreCommand,
  SRandMemberCommand,
  SUnionStoreCommand,
  ZInterStoreCommand,
  ZRemRangeByScoreCommand,
  ZUnionStoreCommand,
} from "./commands"
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

  requestOptions?: {
    /**
     * **fastly only**
     *
     * A Request can be forwarded to any backend defined on your service. Backends
     * can be created via the Fastly CLI, API, or web interface, and are
     * referenced by name.
     */
    backend?: string
  }
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
      options: config.requestOptions,
    })
  }

  /**
   * Create a new Upstash Redis instance from environment variables.
   *
   * Use this to automatically load connection secrets from your environment
   * variables. For instance when using the Vercel integration.
   *
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * your environment using `process.env`.
   *
   * If you are using Cloudflare, please use `onCloudflare()` instead.
   */
  static fromEnv(): Redis {
    if (typeof process?.env === "undefined") {
      throw new Error(
        "Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please use `Redis.onCloudflare()` instead",
      )
    }
    const url = process.env["UPSTASH_REDIS_REST_URL"]
    if (!url) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_URL`")
    }
    const token = process.env["UPSTASH_REDIS_REST_TOKEN"]
    if (!token) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`")
    }
    return new Redis({ url, token })
  }

  /**
   * Create a new Upstash Redis instance from environment variables on cloudflare.
   *
   * This tries to load `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from
   * the global namespace
   */
  static onCloudflare(): Redis {
    /**
     * These should be injected by cloudflare.
     */

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const url = UPSTASH_REDIS_REST_URL

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const token = UPSTASH_REDIS_REST_TOKEN

    if (!url) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_URL`. Please add it via `wrangler secret put UPSTASH_REDIS_REST_URL`",
      )
    }
    if (!token) {
      throw new Error(
        "Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`. Please add it via `wrangler secret put UPSTASH_REDIS_REST_TOKEN`",
      )
    }
    return new Redis({ url, token })
  }

  /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */
  public pipeline(): Pipeline {
    return new Pipeline(this.client)
  }

  /**
   * @see https://redis.io/commands/append
   */
  public append(...args: CommandArgs<typeof AppendCommand>) {
    return new AppendCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitcount
   */
  public bitcount(...args: CommandArgs<typeof BitCountCommand>) {
    return new BitCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitop
   */
  public bitop(
    op: "and" | "or" | "xor",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ): Promise<number>
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public bitop(op: "not", destinationKey: string, sourceKey: string): Promise<number>

  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public bitop(
    op: "and" | "or" | "xor" | "not",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ) {
    return new BitOpCommand(op as any, destinationKey, sourceKey, ...sourceKeys).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitpos
   */
  public bitpos(...args: CommandArgs<typeof BitPosCommand>) {
    return new BitPosCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/dbsize
   */
  public dbsize() {
    return new DBSizeCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/decr
   */
  public decr(...args: CommandArgs<typeof DecrCommand>) {
    return new DecrCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/decrby
   */
  public decrby(...args: CommandArgs<typeof DecrByCommand>) {
    return new DecrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/del
   */
  public del(...args: CommandArgs<typeof DelCommand>) {
    return new DelCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/echo
   */
  public echo(...args: CommandArgs<typeof EchoCommand>) {
    return new EchoCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/exists
   */
  public exists(...args: CommandArgs<typeof ExistsCommand>) {
    return new ExistsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/expire
   */
  public expire(...args: CommandArgs<typeof ExpireCommand>) {
    return new ExpireCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/expireat
   */
  public expireat(...args: CommandArgs<typeof ExpireAtCommand>) {
    return new ExpireAtCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/flushall
   */
  public flushall(...args: CommandArgs<typeof FlushAllCommand>) {
    return new FlushAllCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/flushdb
   */
  public flushdb(...args: CommandArgs<typeof FlushDBCommand>) {
    return new FlushDBCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/get
   */
  public get<TData>(...args: CommandArgs<typeof GetCommand>) {
    return new GetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getbit
   */
  public getbit(...args: CommandArgs<typeof GetBitCommand>) {
    return new GetBitCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getrange
   */
  public getrange(...args: CommandArgs<typeof GetRangeCommand>) {
    return new GetRangeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getset
   */
  public getset<TData>(key: string, value: TData) {
    return new GetSetCommand<TData>(key, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hdel
   */
  public hdel(...args: CommandArgs<typeof HDelCommand>) {
    return new HDelCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hexists
   */
  public hexists(...args: CommandArgs<typeof HExistsCommand>) {
    return new HExistsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hget
   */
  public hget<TData>(...args: CommandArgs<typeof HGetCommand>) {
    return new HGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hgetall
   */
  public hgetall<TData extends Record<string, unknown>>(
    ...args: CommandArgs<typeof HGetAllCommand>
  ) {
    return new HGetAllCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hincrby
   */
  public hincrby(...args: CommandArgs<typeof HIncrByCommand>) {
    return new HIncrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  public hincrbyfloat(...args: CommandArgs<typeof HIncrByFloatCommand>) {
    return new HIncrByFloatCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hkeys
   */
  public hkeys(...args: CommandArgs<typeof HKeysCommand>) {
    return new HKeysCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hlen
   */
  public hlen(...args: CommandArgs<typeof HLenCommand>) {
    return new HLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hmget
   */
  public hmget<TData extends Record<string, unknown>>(...args: CommandArgs<typeof HMGetCommand>) {
    return new HMGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hmset
   */
  public hmset<TData>(key: string, kv: { [field: string]: TData }) {
    return new HMSetCommand(key, kv).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hscan
   */
  public hscan(...args: CommandArgs<typeof HScanCommand>) {
    return new HScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hset
   */
  public hset<TData>(key: string, field: string, value: TData) {
    return new HSetCommand<TData>(key, field, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hsetnx
   */
  public hsetnx<TData>(key: string, field: string, value: TData) {
    return new HSetNXCommand<TData>(key, field, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hstrlen
   */
  public hstrlen(...args: CommandArgs<typeof HStrLenCommand>) {
    return new HStrLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hvals
   */
  public hvals(...args: CommandArgs<typeof HValsCommand>) {
    return new HValsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/incr
   */
  public incr(...args: CommandArgs<typeof IncrCommand>) {
    return new IncrCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/incrby
   */
  public incrby(...args: CommandArgs<typeof IncrByCommand>) {
    return new IncrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  public incrbyfloat(...args: CommandArgs<typeof IncrByFloatCommand>) {
    return new IncrByFloatCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/keys
   */
  public keys(...args: CommandArgs<typeof KeysCommand>) {
    return new KeysCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lindex
   */
  public lindex(...args: CommandArgs<typeof LIndexCommand>) {
    return new LIndexCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/linsert
   */
  public linsert<TData>(key: string, direction: "before" | "after", pivot: TData, value: TData) {
    return new LInsertCommand<TData>(key, direction, pivot, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/llen
   */
  public llen(...args: CommandArgs<typeof LLenCommand>) {
    return new LLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpop
   */
  public lpop<TData>(...args: CommandArgs<typeof LPopCommand>) {
    return new LPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpush
   */
  public lpush<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return new LPushCommand<TData>(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpushx
   */
  public lpushx<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return new LPushXCommand<TData>(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lrange
   */
  public lrange<TResult = string>(...args: CommandArgs<typeof LRangeCommand>) {
    return new LRangeCommand<TResult>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lrem
   */
  public lrem<TData>(key: string, count: number, value: TData) {
    return new LRemCommand(key, count, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lset
   */
  public lset<TData>(key: string, value: TData, index: number) {
    return new LSetCommand(key, value, index).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ltrim
   */
  public ltrim(...args: CommandArgs<typeof LTrimCommand>) {
    return new LTrimCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/mget
   */
  public mget<TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) {
    return new MGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/mset
   */
  public mset<TData>(kv: { [key: string]: TData }) {
    return new MSetCommand<TData>(kv).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/msetnx
   */
  public msetnx<TData>(kv: { [key: string]: TData }) {
    return new MSetNXCommand<TData>(kv).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/persist
   */
  public persist(...args: CommandArgs<typeof PersistCommand>) {
    return new PersistCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pexpire
   */
  public pexpire(...args: CommandArgs<typeof PExpireCommand>) {
    return new PExpireCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pexpireat
   */
  public pexpireat(...args: CommandArgs<typeof PExpireAtCommand>) {
    return new PExpireAtCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ping
   */
  public ping(...args: CommandArgs<typeof PingCommand>) {
    return new PingCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/psetex
   */
  public psetex<TData>(key: string, ttl: number, value: TData) {
    return new PSetEXCommand<TData>(key, ttl, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pttl
   */
  public pttl(...args: CommandArgs<typeof PTtlCommand>) {
    return new PTtlCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/randomkey
   */
  public randomkey() {
    return new RandomKeyCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rename
   */
  public rename(...args: CommandArgs<typeof RenameCommand>) {
    return new RenameCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/renamenx
   */
  public renamenx(...args: CommandArgs<typeof RenameNXCommand>) {
    return new RenameNXCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpop
   */
  public rpop<TData = string>(...args: CommandArgs<typeof RPopCommand>) {
    return new RPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpush
   */
  public rpush<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return new RPushCommand(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpushx
   */
  public rpushx<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return new RPushXCommand(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sadd
   */
  public sadd<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return new SAddCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/scan
   */
  public scan(...args: CommandArgs<typeof ScanCommand>) {
    return new ScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/scard
   */
  public scard(...args: CommandArgs<typeof SCardCommand>) {
    return new SCardCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sdiff
   */
  public sdiff(...args: CommandArgs<typeof SDiffCommand>) {
    return new SDiffCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sdiffstore
   */
  public sdiffstore(...args: CommandArgs<typeof SDiffStoreCommand>) {
    return new SDiffStoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/set
   */
  public set<TData>(key: string, value: TData, opts?: SetCommandOptions) {
    return new SetCommand<TData>(key, value, opts).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setbit
   */
  public setbit(...args: CommandArgs<typeof SetBitCommand>) {
    return new SetBitCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setex
   */
  public setex<TData>(key: string, ttl: number, value: TData) {
    return new SetExCommand<TData>(key, ttl, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setnx
   */
  public setnx<TData>(key: string, value: TData) {
    return new SetNxCommand<TData>(key, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setrange
   */
  public setrange(...args: CommandArgs<typeof SetRangeCommand>) {
    return new SetRangeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sinter
   */
  public sinter(...args: CommandArgs<typeof SInterCommand>) {
    return new SInterCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sinterstore
   */
  public sinterstore(...args: CommandArgs<typeof SInterStoreCommand>) {
    return new SInterStoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sismember
   */
  public sismember<TData>(key: string, member: TData) {
    return new SIsMemberCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/smembers
   */
  public smembers(...args: CommandArgs<typeof SMembersCommand>) {
    return new SMembersCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/smove
   */
  public smove<TData>(source: string, destination: string, member: TData) {
    return new SMoveCommand<TData>(source, destination, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/spop
   */
  public spop<TData>(...args: CommandArgs<typeof SPopCommand>) {
    return new SPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/srandmember
   */
  public srandmember<TData>(...args: CommandArgs<typeof SRandMemberCommand>) {
    return new SRandMemberCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/srem
   */
  public srem<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return new SRemCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sscan
   */
  public sscan(...args: CommandArgs<typeof SScanCommand>) {
    return new SScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/strlen
   */
  public strlen(...args: CommandArgs<typeof StrLenCommand>) {
    return new StrLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sunion
   */
  public sunion(...args: CommandArgs<typeof SUnionCommand>) {
    return new SUnionCommand(...args).exec(this.client)
  }
  /**
   * @see https://redis.io/commands/sunionstore
   */
  public sunionstore(...args: CommandArgs<typeof SUnionStoreCommand>) {
    return new SUnionStoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/time
   */
  public time() {
    return new TimeCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/touch
   */
  public touch(...args: CommandArgs<typeof TouchCommand>) {
    return new TouchCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ttl
   */
  public ttl(...args: CommandArgs<typeof TtlCommand>) {
    return new TtlCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/type
   */
  public type(...args: CommandArgs<typeof TypeCommand>) {
    return new TypeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/unlink
   */
  public unlink(...args: CommandArgs<typeof UnlinkCommand>) {
    return new UnlinkCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zadd
   */
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public zadd<TData>(
    key: string,
    scoreMember: ScoreMember<TData>,
    ...scoreMemberPairs: ScoreMember<TData>[]
  ): Promise<number | null>
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public zadd<TData>(
    key: string,
    opts: ZAddCommandOptions | ZAddCommandOptionsWithIncr,
    ...scoreMemberPairs: [ScoreMember<TData>, ...ScoreMember<TData>[]]
  ): Promise<number | null>
  // eslint-disable-next-line no-dupe-class-members
  public zadd<TData>(
    key: string,
    arg1: ScoreMember<TData> | ZAddCommandOptions | ZAddCommandOptionsWithIncr,
    ...arg2: ScoreMember<TData>[]
  ) {
    if ("score" in arg1) {
      return new ZAddCommand<TData>(key, arg1 as ScoreMember<TData>, ...arg2).exec(this.client)
    }
    return new ZAddCommand<TData>(key, arg1 as any, ...arg2).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zcard
   */
  public zcard(...args: CommandArgs<typeof ZCardCommand>) {
    return new ZCardCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zcount
   */
  public zcount(...args: CommandArgs<typeof ZCountCommand>) {
    return new ZCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zincrby
   */
  public zincrby<TData>(key: string, increment: number, member: TData) {
    return new ZIncrByComand<TData>(key, increment, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zinterstore
   */
  public zinterstore(...args: CommandArgs<typeof ZInterStoreCommand>) {
    return new ZInterStoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zlexcount
   */
  public zlexcount(...args: CommandArgs<typeof ZLexCountCommand>) {
    return new ZLexCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zpopmax
   */
  public zpopmax<TData>(...args: CommandArgs<typeof ZPopMaxCommand>) {
    return new ZPopMaxCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zpopmin
   */
  public zpopmin<TData>(...args: CommandArgs<typeof ZPopMinCommand>) {
    return new ZPopMinCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrange
   */
  public zrange<TData extends unknown[]>(...args: CommandArgs<typeof ZRangeCommand>) {
    return new ZRangeCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrank
   */
  public zrank<TData>(key: string, member: TData) {
    return new ZRankCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrem
   */
  public zrem<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return new ZRemCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  public zremrangebylex(...args: CommandArgs<typeof ZRemRangeByLexCommand>) {
    return new ZRemRangeByLexCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  public zremrangebyrank(...args: CommandArgs<typeof ZRemRangeByRankCommand>) {
    return new ZRemRangeByRankCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  public zremrangebyscore(...args: CommandArgs<typeof ZRemRangeByScoreCommand>) {
    return new ZRemRangeByScoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrevrank
   */
  public zrevrank<TData>(key: string, member: TData) {
    return new ZRevRankCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zscan
   */
  public zscan(...args: CommandArgs<typeof ZScanCommand>) {
    return new ZScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zscore
   */
  public zscore<TData>(key: string, member: TData) {
    return new ZScoreCommand<TData>(key, member).exec(this.client)
  }
  /**
   * @see https://redis.io/commands/zunionstore
   */
  public zunionstore(...args: CommandArgs<typeof ZUnionStoreCommand>) {
    return new ZUnionStoreCommand(...args).exec(this.client)
  }
}
