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
  ScoreMember,
  SDiffCommand,
  SDiffStoreCommand,
  SetBitCommand,
  SetCommand,
  SetCommandOptions,
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
  ZAddCommandOptions,
  ZAddCommandOptionsWithIncr,
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
   *
   * When the config object is omitted, the client will try to load
   * `UPSTASH_REDIS_REST_URL`and `UPSTASH_REDIS_REST_TOKEN` from environment
   * ```ts
   * const redis = new Redis();
   * ```
   */
  constructor(config?: RedisConfig) {
    const url = config?.url ?? process.env.UPSTASH_REDIS_REST_URL
    if (!url) {
      throw new Error(
        "upstash rest url is not specified and can not be loaded from environment as UPSTASH_REDIS_REST_URL",
      )
    }
    const token = config?.token ?? process.env.UPSTASH_REDIS_REST_TOKEN
    if (!token) {
      throw new Error(
        "upstash rest token is not specified and can not be loaded from environment as UPSTASH_REDIS_REST_TOKN",
      )
    }
    this.client = new HttpClient({
      baseUrl: url,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
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
  public async append(...args: CommandArgs<typeof AppendCommand>) {
    return await new AppendCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitcount
   */
  public async bitcount(...args: CommandArgs<typeof BitCountCommand>) {
    return await new BitCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitop
   */
  public async bitop(...args: CommandArgs<typeof BitOpCommand>) {
    return await new BitOpCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/bitpos
   */
  public async bitpos(...args: CommandArgs<typeof BitPosCommand>) {
    return await new BitPosCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/dbsize
   */
  public async dbsize() {
    return await new DBSizeCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/decr
   */
  public async decr(...args: CommandArgs<typeof DecrCommand>) {
    return await new DecrCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/decrby
   */
  public async decrby(...args: CommandArgs<typeof DecrByCommand>) {
    return await new DecrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/del
   */
  public async del(...args: CommandArgs<typeof DelCommand>) {
    return await new DelCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/echo
   */
  public async echo(...args: CommandArgs<typeof EchoCommand>) {
    return await new EchoCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/exists
   */
  public async exists(...args: CommandArgs<typeof ExistsCommand>) {
    return await new ExistsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/expire
   */
  public async expire(...args: CommandArgs<typeof ExpireCommand>) {
    return await new ExpireCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/expireat
   */
  public async expireat(...args: CommandArgs<typeof ExpireAtCommand>) {
    return await new ExpireAtCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/flushall
   */
  public async flushall(...args: CommandArgs<typeof FlushAllCommand>) {
    return await new FlushAllCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/flushdb
   */
  public async flushdb(...args: CommandArgs<typeof FlushDBCommand>) {
    return await new FlushDBCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/get
   */
  public async get<TData>(...args: CommandArgs<typeof GetCommand>) {
    return await new GetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getbit
   */
  public async getbit(...args: CommandArgs<typeof GetBitCommand>) {
    return await new GetBitCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getrange
   */
  public async getrange(...args: CommandArgs<typeof GetRangeCommand>) {
    return await new GetRangeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/getset
   */
  public async getset<TData>(key: string, value: TData) {
    return await new GetSetCommand<TData>(key, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hdel
   */
  public async hdel(...args: CommandArgs<typeof HDelCommand>) {
    return await new HDelCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hexists
   */
  public async hexists(...args: CommandArgs<typeof HExistsCommand>) {
    return await new HExistsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hget
   */
  public async hget<TData>(...args: CommandArgs<typeof HGetCommand>) {
    return await new HGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hgetall
   */
  public async hgetall<TData extends unknown[]>(...args: CommandArgs<typeof HGetAllCommand>) {
    return await new HGetAllCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hincrby
   */
  public async hincrby(...args: CommandArgs<typeof HIncrByCommand>) {
    return await new HIncrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  public async hincrbyfloat(...args: CommandArgs<typeof HIncrByFloatCommand>) {
    return await new HIncrByFloatCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hkeys
   */
  public async hkeys(...args: CommandArgs<typeof HKeysCommand>) {
    return await new HKeysCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hlen
   */
  public async hlen(...args: CommandArgs<typeof HLenCommand>) {
    return await new HLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hmget
   */
  public async hmget<TData extends unknown[]>(...args: CommandArgs<typeof HMGetCommand>) {
    return await new HMGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hmset
   */
  public async hmset<TData = unknown>(key: string, ...kv: { field: string; value: TData }[]) {
    return await new HMSetCommand(key, ...kv).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hscan
   */
  public async hscan(...args: CommandArgs<typeof HScanCommand>) {
    return await new HScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hset
   */
  public async hset<TData>(key: string, field: string, value: TData) {
    return await new HSetCommand<TData>(key, field, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hsetnx
   */
  public async hsetnx<TData>(key: string, field: string, value: TData) {
    return await new HSetNXCommand<TData>(key, field, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hstrlen
   */
  public async hstrlen(...args: CommandArgs<typeof HStrLenCommand>) {
    return await new HStrLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/hvals
   */
  public async hvals(...args: CommandArgs<typeof HValsCommand>) {
    return await new HValsCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/incr
   */
  public async incr(...args: CommandArgs<typeof IncrCommand>) {
    return await new IncrCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/incrby
   */
  public async incrby(...args: CommandArgs<typeof IncrByCommand>) {
    return await new IncrByCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/keys
   */
  public async keys(...args: CommandArgs<typeof KeysCommand>) {
    return await new KeysCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lindex
   */
  public async lindex(...args: CommandArgs<typeof LIndexCommand>) {
    return await new LIndexCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/linsert
   */
  public async linsert<TData>(
    key: string,
    direction: "before" | "after",
    pivot: TData,
    value: TData,
  ) {
    return await new LInsertCommand<TData>(key, direction, pivot, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/llen
   */
  public async llen(...args: CommandArgs<typeof LLenCommand>) {
    return await new LLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpop
   */
  public async lpop<TData>(...args: CommandArgs<typeof LPopCommand>) {
    return await new LPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpush
   */
  public async lpush<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return await new LPushCommand<TData>(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lpushx
   */
  public async lpushx<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return await new LPushXCommand<TData>(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lrange
   */
  public async lrange<TResult = string>(...args: CommandArgs<typeof LRangeCommand>) {
    return await new LRangeCommand<TResult>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lrem
   */
  public async lrem(...args: CommandArgs<typeof LRemCommand>) {
    return await new LRemCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/lset
   */
  public async lset<TData>(key: string, value: TData, index: number) {
    return await new LSetCommand(key, value, index).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ltrim
   */
  public async ltrim(...args: CommandArgs<typeof LTrimCommand>) {
    return await new LTrimCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/mget
   */
  public async mget<TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) {
    return await new MGetCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/mset
   */
  public async mset<TData = unknown>(...kvPairs: { key: string; value: TData }[]) {
    return await new MSetCommand<TData>(...kvPairs).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/msetnx
   */
  public async msetnx<TData = unknown>(...kvPairs: { key: string; value: TData }[]) {
    return await new MSetNXCommand<TData>(...kvPairs).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/persist
   */
  public async persist(...args: CommandArgs<typeof PersistCommand>) {
    return await new PersistCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pexpire
   */
  public async pexpire(...args: CommandArgs<typeof PExpireCommand>) {
    return await new PExpireCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pexpireat
   */
  public async pexpireat(...args: CommandArgs<typeof PExpireAtCommand>) {
    return await new PExpireAtCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ping
   */
  public async ping(...args: CommandArgs<typeof PingCommand>) {
    return await new PingCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/psetex
   */
  public async psetex<TData>(key: string, ttl: number, value: TData) {
    return await new PSetEXCommand<TData>(key, ttl, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/pttl
   */
  public async pttl(...args: CommandArgs<typeof PTtlCommand>) {
    return await new PTtlCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/randomkey
   */
  public async randomkey() {
    return await new RandomKeyCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rename
   */
  public async rename(...args: CommandArgs<typeof RenameCommand>) {
    return await new RenameCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/renamenx
   */
  public async renamenx(...args: CommandArgs<typeof RenameNXCommand>) {
    return await new RenameNXCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpop
   */
  public async rpop<TData = string>(...args: CommandArgs<typeof RPopCommand>) {
    return await new RPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpush
   */
  public async rpush<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return await new RPushCommand(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/rpushx
   */
  public async rpushx<TData>(key: string, ...elements: NonEmptyArray<TData>) {
    return await new RPushXCommand(key, ...elements).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sadd
   */
  public async sadd<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return await new SAddCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/scan
   */
  public async scan(...args: CommandArgs<typeof ScanCommand>) {
    return await new ScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/scard
   */
  public async scard(...args: CommandArgs<typeof SCardCommand>) {
    return await new SCardCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sdiff
   */
  public async sdiff(...args: CommandArgs<typeof SDiffCommand>) {
    return await new SDiffCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sdiffstore
   */
  public async sdiffstore(...args: CommandArgs<typeof SDiffStoreCommand>) {
    return await new SDiffStoreCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/set
   */
  public async set<TData>(key: string, value: TData, opts?: SetCommandOptions) {
    return await new SetCommand<TData>(key, value, opts).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setbit
   */
  public async setbit(...args: CommandArgs<typeof SetBitCommand>) {
    return await new SetBitCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setex
   */
  public async setex<TData>(key: string, ttl: number, value: TData) {
    return await new SetExCommand<TData>(key, ttl, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setnx
   */
  public async setnx<TData>(key: string, value: TData) {
    return await new SetNxCommand<TData>(key, value).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/setrange
   */
  public async setrange(...args: CommandArgs<typeof SetRangeCommand>) {
    return await new SetRangeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sinter
   */
  public async sinter(...args: CommandArgs<typeof SInterCommand>) {
    return await new SInterCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sismember
   */
  public async sismember<TData>(key: string, member: TData) {
    return await new SIsMemberCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/smembers
   */
  public async smembers(...args: CommandArgs<typeof SMembersCommand>) {
    return await new SMembersCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/smove
   */
  public async smove<TData>(source: string, destination: string, member: TData) {
    return await new SMoveCommand<TData>(source, destination, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/spop
   */
  public async spop<TData>(...args: CommandArgs<typeof SPopCommand>) {
    return await new SPopCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/srem
   */
  public async srem<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return await new SRemCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sscan
   */
  public async sscan(...args: CommandArgs<typeof SScanCommand>) {
    return await new SScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/strlen
   */
  public async strlen(...args: CommandArgs<typeof StrLenCommand>) {
    return await new StrLenCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/sunion
   */
  public async sunion(...args: CommandArgs<typeof SUnionCommand>) {
    return await new SUnionCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/time
   */
  public async time() {
    return await new TimeCommand().exec(this.client)
  }

  /**
   * @see https://redis.io/commands/touch
   */
  public async touch(...args: CommandArgs<typeof TouchCommand>) {
    return await new TouchCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/ttl
   */
  public async ttl(...args: CommandArgs<typeof TtlCommand>) {
    return await new TtlCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/type
   */
  public async type(...args: CommandArgs<typeof TypeCommand>) {
    return await new TypeCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/unlink
   */
  public async unlink(...args: CommandArgs<typeof UnlinkCommand>) {
    return await new UnlinkCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zadd
   */
  // eslint-disable-next-line no-dupe-class-members
  public async zadd<TData, TResult = "OK">(
    key: string,
    scoreMember: ScoreMember<TData>,
    ...scoreMemberPairs: ScoreMember<TData>[]
  ): Promise<TResult>
  // eslint-disable-next-line no-dupe-class-members
  public async zadd<TData, TResult = "OK">(
    key: string,
    opts: ZAddCommandOptions,
    ...scoreMemberPairs: [ScoreMember<TData>, ...ScoreMember<TData>[]]
  ): Promise<TResult>
  // eslint-disable-next-line no-dupe-class-members
  public async zadd<TData, TResult = "OK">(
    key: string,
    arg1: ScoreMember<TData> | ZAddCommandOptions | ZAddCommandOptionsWithIncr,
    ...arg2: ScoreMember<TData>[]
  ): Promise<TResult> {
    if ("score" in arg1) {
      return await new ZAddCommand<TData, TResult>(key, arg1 as ScoreMember<TData>, ...arg2).exec(
        this.client,
      )
    }
    return await new ZAddCommand<TData, TResult>(key, arg1, ...arg2).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zcard
   */
  public async zcard(...args: CommandArgs<typeof ZCardCommand>) {
    return await new ZCardCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zcount
   */
  public async zcount(...args: CommandArgs<typeof ZCountCommand>) {
    return await new ZCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zincrby
   */
  public async zincrby<TData>(key: string, increment: number, member: TData) {
    return await new ZIncrByComand<TData>(key, increment, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zlexcount
   */
  public async zlexcount(...args: CommandArgs<typeof ZLexCountCommand>) {
    return await new ZLexCountCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zpopmax
   */
  public async zpopmax<TData>(...args: CommandArgs<typeof ZPopMaxCommand>) {
    return await new ZPopMaxCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zpopmin
   */
  public async zpopmin<TData>(...args: CommandArgs<typeof ZPopMinCommand>) {
    return await new ZPopMinCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrange
   */
  public async zrange<TData extends unknown[]>(...args: CommandArgs<typeof ZRangeCommand>) {
    return await new ZRangeCommand<TData>(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrank
   */
  public async zrank<TData>(key: string, member: TData) {
    return await new ZRankCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrem
   */
  public async zrem<TData>(key: string, ...members: NonEmptyArray<TData>) {
    return await new ZRemCommand<TData>(key, ...members).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  public async zremrangebylex(...args: CommandArgs<typeof ZRemRangeByLexCommand>) {
    return await new ZRemRangeByLexCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  public async zremrangebyrank(...args: CommandArgs<typeof ZRemRangeByRankCommand>) {
    return await new ZRemRangeByRankCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zrevrank
   */
  public async zrevrank<TData>(key: string, member: TData) {
    return await new ZRevRankCommand<TData>(key, member).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zscan
   */
  public async zscan(...args: CommandArgs<typeof ZScanCommand>) {
    return await new ZScanCommand(...args).exec(this.client)
  }

  /**
   * @see https://redis.io/commands/zscore
   */
  public async zscore<TData>(key: string, member: TData) {
    return await new ZScoreCommand<TData>(key, member).exec(this.client)
  }
}
