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
  ZRangeCommandOptions,
} from "./commands"
import { Pipeline } from "./pipeline"
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
  constructor(client: HttpClient) {
    this.client = client
  }

  /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */
  pipeline = () => new Pipeline(this.client)

  /**
   * @see https://redis.io/commands/append
   */
  append = (...args: CommandArgs<typeof AppendCommand>) =>
    new AppendCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/bitcount
   */
  bitcount = (...args: CommandArgs<typeof BitCountCommand>) =>
    new BitCountCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/bitop
   */
  bitop: {
    (
      op: "and" | "or" | "xor",
      destinationKey: string,
      sourceKey: string,
      ...sourceKeys: string[]
    ): Promise<number>
    (op: "not", destinationKey: string, sourceKey: string): Promise<number>
  } = (
    op: "and" | "or" | "xor" | "not",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ) => new BitOpCommand(op as any, destinationKey, sourceKey, ...sourceKeys).exec(this.client)

  /**
   * @see https://redis.io/commands/bitpos
   */
  bitpos = (...args: CommandArgs<typeof BitPosCommand>) =>
    new BitPosCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/dbsize
   */
  dbsize = () => new DBSizeCommand().exec(this.client)

  /**
   * @see https://redis.io/commands/decr
   */
  decr = (...args: CommandArgs<typeof DecrCommand>) => new DecrCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/decrby
   */
  decrby = (...args: CommandArgs<typeof DecrByCommand>) =>
    new DecrByCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/del
   */
  del = (...args: CommandArgs<typeof DelCommand>) => new DelCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/echo
   */
  echo = (...args: CommandArgs<typeof EchoCommand>) => new EchoCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/exists
   */
  exists = (...args: CommandArgs<typeof ExistsCommand>) =>
    new ExistsCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/expire
   */
  expire = (...args: CommandArgs<typeof ExpireCommand>) =>
    new ExpireCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/expireat
   */
  expireat = (...args: CommandArgs<typeof ExpireAtCommand>) =>
    new ExpireAtCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/flushall
   */
  flushall = (...args: CommandArgs<typeof FlushAllCommand>) =>
    new FlushAllCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/flushdb
   */
  flushdb = (...args: CommandArgs<typeof FlushDBCommand>) =>
    new FlushDBCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/get
   */
  get = <TData>(...args: CommandArgs<typeof GetCommand>) =>
    new GetCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/getbit
   */
  getbit = (...args: CommandArgs<typeof GetBitCommand>) =>
    new GetBitCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/getrange
   */
  getrange = (...args: CommandArgs<typeof GetRangeCommand>) =>
    new GetRangeCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/getset
   */
  getset = <TData>(key: string, value: TData) =>
    new GetSetCommand<TData>(key, value).exec(this.client)

  /**
   * @see https://redis.io/commands/hdel
   */
  hdel = (...args: CommandArgs<typeof HDelCommand>) => new HDelCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hexists
   */
  hexists = (...args: CommandArgs<typeof HExistsCommand>) =>
    new HExistsCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hget
   */
  hget = <TData>(...args: CommandArgs<typeof HGetCommand>) =>
    new HGetCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hgetall
   */
  hgetall = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetAllCommand>) =>
    new HGetAllCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hincrby
   */
  hincrby = (...args: CommandArgs<typeof HIncrByCommand>) =>
    new HIncrByCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  hincrbyfloat = (...args: CommandArgs<typeof HIncrByFloatCommand>) =>
    new HIncrByFloatCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hkeys
   */
  hkeys = (...args: CommandArgs<typeof HKeysCommand>) => new HKeysCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hlen
   */
  hlen = (...args: CommandArgs<typeof HLenCommand>) => new HLenCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hmget
   */
  hmget = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HMGetCommand>) =>
    new HMGetCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = <TData>(key: string, kv: { [field: string]: TData }) =>
    new HMSetCommand(key, kv).exec(this.client)

  /**
   * @see https://redis.io/commands/hscan
   */
  hscan = (...args: CommandArgs<typeof HScanCommand>) => new HScanCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hset
   */
  hset = <TData>(key: string, kv: { [field: string]: TData }) =>
    new HSetCommand<TData>(key, kv).exec(this.client)

  /**
   * @see https://redis.io/commands/hsetnx
   */
  hsetnx = <TData>(key: string, field: string, value: TData) =>
    new HSetNXCommand<TData>(key, field, value).exec(this.client)

  /**
   * @see https://redis.io/commands/hstrlen
   */
  hstrlen = (...args: CommandArgs<typeof HStrLenCommand>) =>
    new HStrLenCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/hvals
   */
  hvals = (...args: CommandArgs<typeof HValsCommand>) => new HValsCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/incr
   */
  incr = (...args: CommandArgs<typeof IncrCommand>) => new IncrCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/incrby
   */
  incrby = (...args: CommandArgs<typeof IncrByCommand>) =>
    new IncrByCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  incrbyfloat = (...args: CommandArgs<typeof IncrByFloatCommand>) =>
    new IncrByFloatCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/keys
   */
  keys = (...args: CommandArgs<typeof KeysCommand>) => new KeysCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/lindex
   */
  lindex = (...args: CommandArgs<typeof LIndexCommand>) =>
    new LIndexCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/linsert
   */
  linsert = <TData>(key: string, direction: "before" | "after", pivot: TData, value: TData) =>
    new LInsertCommand<TData>(key, direction, pivot, value).exec(this.client)

  /**
   * @see https://redis.io/commands/llen
   */
  llen = (...args: CommandArgs<typeof LLenCommand>) => new LLenCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/lpop
   */
  lpop = <TData>(...args: CommandArgs<typeof LPopCommand>) =>
    new LPopCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/lpush
   */
  lpush = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    new LPushCommand<TData>(key, ...elements).exec(this.client)

  /**
   * @see https://redis.io/commands/lpushx
   */
  lpushx = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    new LPushXCommand<TData>(key, ...elements).exec(this.client)

  /**
   * @see https://redis.io/commands/lrange
   */
  lrange = <TResult = string>(...args: CommandArgs<typeof LRangeCommand>) =>
    new LRangeCommand<TResult>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/lrem
   */
  lrem = <TData>(key: string, count: number, value: TData) =>
    new LRemCommand(key, count, value).exec(this.client)

  /**
   * @see https://redis.io/commands/lset
   */
  lset = <TData>(key: string, value: TData, index: number) =>
    new LSetCommand(key, value, index).exec(this.client)

  /**
   * @see https://redis.io/commands/ltrim
   */
  ltrim = (...args: CommandArgs<typeof LTrimCommand>) => new LTrimCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/mget
   */
  mget = <TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) =>
    new MGetCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/mset
   */
  mset = <TData>(kv: { [key: string]: TData }) => new MSetCommand<TData>(kv).exec(this.client)

  /**
   * @see https://redis.io/commands/msetnx
   */
  msetnx = <TData>(kv: { [key: string]: TData }) => new MSetNXCommand<TData>(kv).exec(this.client)

  /**
   * @see https://redis.io/commands/persist
   */
  persist = (...args: CommandArgs<typeof PersistCommand>) =>
    new PersistCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/pexpire
   */
  pexpire = (...args: CommandArgs<typeof PExpireCommand>) =>
    new PExpireCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/pexpireat
   */
  pexpireat = (...args: CommandArgs<typeof PExpireAtCommand>) =>
    new PExpireAtCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/ping
   */
  ping = (...args: CommandArgs<typeof PingCommand>) => new PingCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = <TData>(key: string, ttl: number, value: TData) =>
    new PSetEXCommand<TData>(key, ttl, value).exec(this.client)

  /**
   * @see https://redis.io/commands/pttl
   */
  pttl = (...args: CommandArgs<typeof PTtlCommand>) => new PTtlCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/randomkey
   */
  randomkey = () => new RandomKeyCommand().exec(this.client)

  /**
   * @see https://redis.io/commands/rename
   */
  rename = (...args: CommandArgs<typeof RenameCommand>) =>
    new RenameCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/renamenx
   */
  renamenx = (...args: CommandArgs<typeof RenameNXCommand>) =>
    new RenameNXCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/rpop
   */
  rpop = <TData = string>(...args: CommandArgs<typeof RPopCommand>) =>
    new RPopCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/rpush
   */
  rpush = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    new RPushCommand(key, ...elements).exec(this.client)

  /**
   * @see https://redis.io/commands/rpushx
   */
  rpushx = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    new RPushXCommand(key, ...elements).exec(this.client)

  /**
   * @see https://redis.io/commands/sadd
   */
  sadd = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    new SAddCommand<TData>(key, ...members).exec(this.client)

  /**
   * @see https://redis.io/commands/scan
   */
  scan = (...args: CommandArgs<typeof ScanCommand>) => new ScanCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/scard
   */
  scard = (...args: CommandArgs<typeof SCardCommand>) => new SCardCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sdiff
   */
  sdiff = (...args: CommandArgs<typeof SDiffCommand>) => new SDiffCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sdiffstore
   */
  sdiffstore = (...args: CommandArgs<typeof SDiffStoreCommand>) =>
    new SDiffStoreCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/set
   */
  set = <TData>(key: string, value: TData, opts?: SetCommandOptions) =>
    new SetCommand<TData>(key, value, opts).exec(this.client)

  /**
   * @see https://redis.io/commands/setbit
   */
  setbit = (...args: CommandArgs<typeof SetBitCommand>) =>
    new SetBitCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/setex
   */
  setex = <TData>(key: string, ttl: number, value: TData) =>
    new SetExCommand<TData>(key, ttl, value).exec(this.client)

  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = <TData>(key: string, value: TData) =>
    new SetNxCommand<TData>(key, value).exec(this.client)

  /**
   * @see https://redis.io/commands/setrange
   */
  setrange = (...args: CommandArgs<typeof SetRangeCommand>) =>
    new SetRangeCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sinter
   */
  sinter = (...args: CommandArgs<typeof SInterCommand>) =>
    new SInterCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sinterstore
   */
  sinterstore = (...args: CommandArgs<typeof SInterStoreCommand>) =>
    new SInterStoreCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sismember
   */
  sismember = <TData>(key: string, member: TData) =>
    new SIsMemberCommand<TData>(key, member).exec(this.client)

  /**
   * @see https://redis.io/commands/smembers
   */
  smembers = (...args: CommandArgs<typeof SMembersCommand>) =>
    new SMembersCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/smove
   */
  smove = <TData>(source: string, destination: string, member: TData) =>
    new SMoveCommand<TData>(source, destination, member).exec(this.client)

  /**
   * @see https://redis.io/commands/spop
   */
  spop = <TData>(...args: CommandArgs<typeof SPopCommand>) =>
    new SPopCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/srandmember
   */
  srandmember = <TData>(...args: CommandArgs<typeof SRandMemberCommand>) =>
    new SRandMemberCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/srem
   */
  srem = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    new SRemCommand<TData>(key, ...members).exec(this.client)

  /**
   * @see https://redis.io/commands/sscan
   */
  sscan = (...args: CommandArgs<typeof SScanCommand>) => new SScanCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/strlen
   */
  strlen = (...args: CommandArgs<typeof StrLenCommand>) =>
    new StrLenCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sunion
   */
  sunion = (...args: CommandArgs<typeof SUnionCommand>) =>
    new SUnionCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/sunionstore
   */
  sunionstore = (...args: CommandArgs<typeof SUnionStoreCommand>) =>
    new SUnionStoreCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/time
   */
  time = () => new TimeCommand().exec(this.client)

  /**
   * @see https://redis.io/commands/touch
   */
  touch = (...args: CommandArgs<typeof TouchCommand>) => new TouchCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/ttl
   */
  ttl = (...args: CommandArgs<typeof TtlCommand>) => new TtlCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/type
   */
  type = (...args: CommandArgs<typeof TypeCommand>) => new TypeCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/unlink
   */
  unlink = (...args: CommandArgs<typeof UnlinkCommand>) =>
    new UnlinkCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zadd
   */
  zadd = <TData>(
    ...args:
      | [key: string, scoreMember: ScoreMember<TData>, ...scoreMemberPairs: ScoreMember<TData>[]]
      | [
          key: string,
          opts: ZAddCommandOptions | ZAddCommandOptionsWithIncr,
          ...scoreMemberPairs: [ScoreMember<TData>, ...ScoreMember<TData>[]]
        ]
  ) => {
    if ("score" in args[1]) {
      return new ZAddCommand<TData>(
        args[0],
        args[1] as ScoreMember<TData>,
        ...(args.slice(2) as any),
      ).exec(this.client)
    }

    return new ZAddCommand<TData>(args[0], args[1] as any, ...(args.slice(2) as any)).exec(
      this.client,
    )
  }
  /**
   * @see https://redis.io/commands/zcard
   */
  zcard = (...args: CommandArgs<typeof ZCardCommand>) => new ZCardCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zcount
   */
  zcount = (...args: CommandArgs<typeof ZCountCommand>) =>
    new ZCountCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zincrby
   */
  zincrby = <TData>(key: string, increment: number, member: TData) =>
    new ZIncrByComand<TData>(key, increment, member).exec(this.client)

  /**
   * @see https://redis.io/commands/zinterstore
   */
  zinterstore = (...args: CommandArgs<typeof ZInterStoreCommand>) =>
    new ZInterStoreCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zlexcount
   */
  zlexcount = (...args: CommandArgs<typeof ZLexCountCommand>) =>
    new ZLexCountCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zpopmax
   */
  zpopmax = <TData>(...args: CommandArgs<typeof ZPopMaxCommand>) =>
    new ZPopMaxCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zpopmin
   */
  zpopmin = <TData>(...args: CommandArgs<typeof ZPopMinCommand>) =>
    new ZPopMinCommand<TData>(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zrange
   */
  zrange = <TData extends unknown[]>(
    ...args:
      | [key: string, min: number, max: number, opts?: ZRangeCommandOptions]
      | [
          key: string,
          min: `(${string}` | `[${string}` | "-" | "+",
          max: `(${string}` | `[${string}` | "-" | "+",
          opts: { byLex: true } & ZRangeCommandOptions,
        ]
      | [
          key: string,
          min: number | `(${number}` | "-inf" | "+inf",
          max: number | `(${number}` | "-inf" | "+inf",
          opts: { byScore: true } & ZRangeCommandOptions,
        ]
  ) => new ZRangeCommand<TData>(args[0], args[1] as any, args[2] as any, args[3]).exec(this.client)

  /**
   * @see https://redis.io/commands/zrank
   */
  zrank = <TData>(key: string, member: TData) =>
    new ZRankCommand<TData>(key, member).exec(this.client)

  /**
   * @see https://redis.io/commands/zrem
   */
  zrem = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    new ZRemCommand<TData>(key, ...members).exec(this.client)

  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  zremrangebylex = (...args: CommandArgs<typeof ZRemRangeByLexCommand>) =>
    new ZRemRangeByLexCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  zremrangebyrank = (...args: CommandArgs<typeof ZRemRangeByRankCommand>) =>
    new ZRemRangeByRankCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  zremrangebyscore = (...args: CommandArgs<typeof ZRemRangeByScoreCommand>) =>
    new ZRemRangeByScoreCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zrevrank
   */
  zrevrank = <TData>(key: string, member: TData) =>
    new ZRevRankCommand<TData>(key, member).exec(this.client)

  /**
   * @see https://redis.io/commands/zscan
   */
  zscan = (...args: CommandArgs<typeof ZScanCommand>) => new ZScanCommand(...args).exec(this.client)

  /**
   * @see https://redis.io/commands/zscore
   */
  zscore = <TData>(key: string, member: TData) =>
    new ZScoreCommand<TData>(key, member).exec(this.client)

  /**
   * @see https://redis.io/commands/zunionstore
   */
  zunionstore = (...args: CommandArgs<typeof ZUnionStoreCommand>) =>
    new ZUnionStoreCommand(...args).exec(this.client)
}
