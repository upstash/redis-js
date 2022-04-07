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
  PublishCommand,
} from "./commands"
import { Command } from "./commands/command"
import { UpstashError } from "./error"
import { HttpClient } from "./http"
import { UpstashResponse } from "./http"
import { NonEmptyArray } from "./types"
import { CommandArgs } from "./types"

/**
 * Upstash REST API supports command pipelining to send multiple commands in
 * batch, instead of sending each command one by one and waiting for a response.
 * When using pipelines, several commands are sent using a single HTTP request,
 * and a single JSON array response is returned. Each item in the response array
 * corresponds to the command in the same order within the pipeline.
 *
 * **NOTE:**
 *
 * Execution of the pipeline is not atomic. Even though each command in
 * the pipeline will be executed in order, commands sent by other clients can
 * interleave with the pipeline.
 *
 *
 * **Examples:**
 *
 * ```ts
 *  const p = redis.pipeline()
 * p.set("key","value")
 * p.get("key")
 * const res = await p.exec()
 * ```
 *
 * You can also chain commands together
 * ```ts
 * const p = redis.pipeline()
 * const res = await p.set("key","value").get("key").exec()
 * ```
 *
 * It's not possible to infer correct types with a dynamic pipeline, so you can
 * override the response type manually:
 * ```ts
 *  redis.pipeline()
 *   .set("key", { greeting: "hello"})
 *   .get("key")
 *   .exec<["OK", { greeting: string } ]>()
 *
 * ```
 */
export class Pipeline {
  private client: HttpClient
  private commands: Command<unknown, unknown>[]

  constructor(client: HttpClient) {
    this.client = client

    this.commands = []
  }

  /**
   * Send the pipeline request to upstash.
   *
   * Returns an array with the results of all pipelined commands.
   *
   * You can define a return type manually to make working in typescript easier
   * ```ts
   * redis.pipeline().get("key").exec<[{ greeting: string }]>()
   * ```
   */
  exec = async <TCommandResults extends unknown[] = unknown[]>(): Promise<TCommandResults> => {
    if (this.commands.length === 0) {
      throw new Error("Pipeline is empty")
    }

    const res = await this.client.request<UpstashResponse<any>[]>({
      path: ["pipeline"],
      body: Object.values(this.commands).map((c) => c.command),
    })
    return res.map(({ error, result }, i) => {
      if (error) {
        throw new UpstashError(
          `Command ${i + 1} [ ${this.commands[i].command[0]} ] failed: ${error}`,
        )
      }
      return this.commands[i].deserialize(result)
    }) as TCommandResults
  }

  /**
   * Pushes a command into the pipelien and returns a chainable instance of the
   * pipeline
   */
  private chain<T>(command: Command<T, any>): this {
    this.commands.push(command)
    return this
  }

  /**
   * @see https://redis.io/commands/append
   */
  append = (...args: CommandArgs<typeof AppendCommand>) => this.chain(new AppendCommand(...args))

  /**
   * @see https://redis.io/commands/bitcount
   */
  bitcount = (...args: CommandArgs<typeof BitCountCommand>) =>
    this.chain(new BitCountCommand(...args))

  /**
   * @see https://redis.io/commands/bitop
   */
  bitop: {
    (
      op: "and" | "or" | "xor",
      destinationKey: string,
      sourceKey: string,
      ...sourceKeys: string[]
    ): Pipeline
    (op: "not", destinationKey: string, sourceKey: string): Pipeline
  } = (
    op: "and" | "or" | "xor" | "not",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ) => this.chain(new BitOpCommand(op as any, destinationKey, sourceKey, ...sourceKeys))

  /**
   * @see https://redis.io/commands/bitpos
   */
  bitpos = (...args: CommandArgs<typeof BitPosCommand>) => this.chain(new BitPosCommand(...args))

  /**
   * @see https://redis.io/commands/dbsize
   */
  dbsize = () => this.chain(new DBSizeCommand())

  /**
   * @see https://redis.io/commands/decr
   */
  decr = (...args: CommandArgs<typeof DecrCommand>) => this.chain(new DecrCommand(...args))

  /**
   * @see https://redis.io/commands/decrby
   */
  decrby = (...args: CommandArgs<typeof DecrByCommand>) => this.chain(new DecrByCommand(...args))

  /**
   * @see https://redis.io/commands/del
   */
  del = (...args: CommandArgs<typeof DelCommand>) => this.chain(new DelCommand(...args))

  /**
   * @see https://redis.io/commands/echo
   */
  echo = (...args: CommandArgs<typeof EchoCommand>) => this.chain(new EchoCommand(...args))

  /**
   * @see https://redis.io/commands/exists
   */
  exists = (...args: CommandArgs<typeof ExistsCommand>) => this.chain(new ExistsCommand(...args))

  /**
   * @see https://redis.io/commands/expire
   */
  expire = (...args: CommandArgs<typeof ExpireCommand>) => this.chain(new ExpireCommand(...args))

  /**
   * @see https://redis.io/commands/expireat
   */
  expireat = (...args: CommandArgs<typeof ExpireAtCommand>) =>
    this.chain(new ExpireAtCommand(...args))

  /**
   * @see https://redis.io/commands/flushall
   */
  flushall = (...args: CommandArgs<typeof FlushAllCommand>) =>
    this.chain(new FlushAllCommand(...args))

  /**
   * @see https://redis.io/commands/flushdb
   */
  flushdb = (...args: CommandArgs<typeof FlushDBCommand>) => this.chain(new FlushDBCommand(...args))

  /**
   * @see https://redis.io/commands/get
   */
  get = <TData>(...args: CommandArgs<typeof GetCommand>) =>
    this.chain(new GetCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/getbit
   */
  getbit = (...args: CommandArgs<typeof GetBitCommand>) => this.chain(new GetBitCommand(...args))

  /**
   * @see https://redis.io/commands/getrange
   */
  getrange = (...args: CommandArgs<typeof GetRangeCommand>) =>
    this.chain(new GetRangeCommand(...args))

  /**
   * @see https://redis.io/commands/getset
   */
  getset = <TData>(key: string, value: TData) => this.chain(new GetSetCommand<TData>(key, value))

  /**
   * @see https://redis.io/commands/hdel
   */
  hdel = (...args: CommandArgs<typeof HDelCommand>) => this.chain(new HDelCommand(...args))

  /**
   * @see https://redis.io/commands/hexists
   */
  hexists = (...args: CommandArgs<typeof HExistsCommand>) => this.chain(new HExistsCommand(...args))

  /**
   * @see https://redis.io/commands/hget
   */
  hget = <TData>(...args: CommandArgs<typeof HGetCommand>) =>
    this.chain(new HGetCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/hgetall
   */
  hgetall = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetAllCommand>) =>
    this.chain(new HGetAllCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/hincrby
   */
  hincrby = (...args: CommandArgs<typeof HIncrByCommand>) => this.chain(new HIncrByCommand(...args))

  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  hincrbyfloat = (...args: CommandArgs<typeof HIncrByFloatCommand>) =>
    this.chain(new HIncrByFloatCommand(...args))

  /**
   * @see https://redis.io/commands/hkeys
   */
  hkeys = (...args: CommandArgs<typeof HKeysCommand>) => this.chain(new HKeysCommand(...args))

  /**
   * @see https://redis.io/commands/hlen
   */
  hlen = (...args: CommandArgs<typeof HLenCommand>) => this.chain(new HLenCommand(...args))

  /**
   * @see https://redis.io/commands/hmget
   */
  hmget = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HMGetCommand>) =>
    this.chain(new HMGetCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = <TData>(key: string, kv: { [field: string]: TData }) =>
    this.chain(new HMSetCommand(key, kv))

  /**
   * @see https://redis.io/commands/hscan
   */
  hscan = (...args: CommandArgs<typeof HScanCommand>) => this.chain(new HScanCommand(...args))

  /**
   * @see https://redis.io/commands/hset
   */
  hset = <TData>(key: string, kv: { [field: string]: TData }) =>
    this.chain(new HSetCommand<TData>(key, kv))

  /**
   * @see https://redis.io/commands/hsetnx
   */
  hsetnx = <TData>(key: string, field: string, value: TData) =>
    this.chain(new HSetNXCommand<TData>(key, field, value))

  /**
   * @see https://redis.io/commands/hstrlen
   */
  hstrlen = (...args: CommandArgs<typeof HStrLenCommand>) => this.chain(new HStrLenCommand(...args))

  /**
   * @see https://redis.io/commands/hvals
   */
  hvals = (...args: CommandArgs<typeof HValsCommand>) => this.chain(new HValsCommand(...args))

  /**
   * @see https://redis.io/commands/incr
   */
  incr = (...args: CommandArgs<typeof IncrCommand>) => this.chain(new IncrCommand(...args))

  /**
   * @see https://redis.io/commands/incrby
   */
  incrby = (...args: CommandArgs<typeof IncrByCommand>) => this.chain(new IncrByCommand(...args))

  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  incrbyfloat = (...args: CommandArgs<typeof IncrByFloatCommand>) =>
    this.chain(new IncrByFloatCommand(...args))

  /**
   * @see https://redis.io/commands/keys
   */
  keys = (...args: CommandArgs<typeof KeysCommand>) => this.chain(new KeysCommand(...args))

  /**
   * @see https://redis.io/commands/lindex
   */
  lindex = (...args: CommandArgs<typeof LIndexCommand>) => this.chain(new LIndexCommand(...args))

  /**
   * @see https://redis.io/commands/linsert
   */
  linsert = <TData>(key: string, direction: "before" | "after", pivot: TData, value: TData) =>
    this.chain(new LInsertCommand<TData>(key, direction, pivot, value))

  /**
   * @see https://redis.io/commands/llen
   */
  llen = (...args: CommandArgs<typeof LLenCommand>) => this.chain(new LLenCommand(...args))

  /**
   * @see https://redis.io/commands/lpop
   */
  lpop = <TData>(...args: CommandArgs<typeof LPopCommand>) =>
    this.chain(new LPopCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/lpush
   */
  lpush = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    this.chain(new LPushCommand<TData>(key, ...elements))

  /**
   * @see https://redis.io/commands/lpushx
   */
  lpushx = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    this.chain(new LPushXCommand<TData>(key, ...elements))

  /**
   * @see https://redis.io/commands/lrange
   */
  lrange = <TResult = string>(...args: CommandArgs<typeof LRangeCommand>) =>
    this.chain(new LRangeCommand<TResult>(...args))

  /**
   * @see https://redis.io/commands/lrem
   */
  lrem = <TData>(key: string, count: number, value: TData) =>
    this.chain(new LRemCommand(key, count, value))

  /**
   * @see https://redis.io/commands/lset
   */
  lset = <TData>(key: string, value: TData, index: number) =>
    this.chain(new LSetCommand(key, value, index))

  /**
   * @see https://redis.io/commands/ltrim
   */
  ltrim = (...args: CommandArgs<typeof LTrimCommand>) => this.chain(new LTrimCommand(...args))

  /**
   * @see https://redis.io/commands/mget
   */
  mget = <TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) =>
    this.chain(new MGetCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/mset
   */
  mset = <TData>(kv: { [key: string]: TData }) => this.chain(new MSetCommand<TData>(kv))

  /**
   * @see https://redis.io/commands/msetnx
   */
  msetnx = <TData>(kv: { [key: string]: TData }) => this.chain(new MSetNXCommand<TData>(kv))

  /**
   * @see https://redis.io/commands/persist
   */
  persist = (...args: CommandArgs<typeof PersistCommand>) => this.chain(new PersistCommand(...args))

  /**
   * @see https://redis.io/commands/pexpire
   */
  pexpire = (...args: CommandArgs<typeof PExpireCommand>) => this.chain(new PExpireCommand(...args))

  /**
   * @see https://redis.io/commands/pexpireat
   */
  pexpireat = (...args: CommandArgs<typeof PExpireAtCommand>) =>
    this.chain(new PExpireAtCommand(...args))

  /**
   * @see https://redis.io/commands/ping
   */
  ping = (...args: CommandArgs<typeof PingCommand>) => this.chain(new PingCommand(...args))

  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = <TData>(key: string, ttl: number, value: TData) =>
    this.chain(new PSetEXCommand<TData>(key, ttl, value))

  /**
   * @see https://redis.io/commands/pttl
   */
  pttl = (...args: CommandArgs<typeof PTtlCommand>) => this.chain(new PTtlCommand(...args))

  /**
   * @see https://redis.io/commands/publish
   */
  publish = (...args: CommandArgs<typeof PublishCommand>) => this.chain(new PublishCommand(...args))

  /**
   * @see https://redis.io/commands/randomkey
   */
  randomkey = () => this.chain(new RandomKeyCommand())

  /**
   * @see https://redis.io/commands/rename
   */
  rename = (...args: CommandArgs<typeof RenameCommand>) => this.chain(new RenameCommand(...args))

  /**
   * @see https://redis.io/commands/renamenx
   */
  renamenx = (...args: CommandArgs<typeof RenameNXCommand>) =>
    this.chain(new RenameNXCommand(...args))

  /**
   * @see https://redis.io/commands/rpop
   */
  rpop = <TData = string>(...args: CommandArgs<typeof RPopCommand>) =>
    this.chain(new RPopCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/rpush
   */
  rpush = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    this.chain(new RPushCommand(key, ...elements))

  /**
   * @see https://redis.io/commands/rpushx
   */
  rpushx = <TData>(key: string, ...elements: NonEmptyArray<TData>) =>
    this.chain(new RPushXCommand(key, ...elements))

  /**
   * @see https://redis.io/commands/sadd
   */
  sadd = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    this.chain(new SAddCommand<TData>(key, ...members))

  /**
   * @see https://redis.io/commands/scan
   */
  scan = (...args: CommandArgs<typeof ScanCommand>) => this.chain(new ScanCommand(...args))

  /**
   * @see https://redis.io/commands/scard
   */
  scard = (...args: CommandArgs<typeof SCardCommand>) => this.chain(new SCardCommand(...args))

  /**
   * @see https://redis.io/commands/sdiff
   */
  sdiff = (...args: CommandArgs<typeof SDiffCommand>) => this.chain(new SDiffCommand(...args))

  /**
   * @see https://redis.io/commands/sdiffstore
   */
  sdiffstore = (...args: CommandArgs<typeof SDiffStoreCommand>) =>
    this.chain(new SDiffStoreCommand(...args))

  /**
   * @see https://redis.io/commands/set
   */
  set = <TData>(key: string, value: TData, opts?: SetCommandOptions) =>
    this.chain(new SetCommand<TData>(key, value, opts))

  /**
   * @see https://redis.io/commands/setbit
   */
  setbit = (...args: CommandArgs<typeof SetBitCommand>) => this.chain(new SetBitCommand(...args))

  /**
   * @see https://redis.io/commands/setex
   */
  setex = <TData>(key: string, ttl: number, value: TData) =>
    this.chain(new SetExCommand<TData>(key, ttl, value))

  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = <TData>(key: string, value: TData) => this.chain(new SetNxCommand<TData>(key, value))

  /**
   * @see https://redis.io/commands/setrange
   */
  setrange = (...args: CommandArgs<typeof SetRangeCommand>) =>
    this.chain(new SetRangeCommand(...args))

  /**
   * @see https://redis.io/commands/sinter
   */
  sinter = (...args: CommandArgs<typeof SInterCommand>) => this.chain(new SInterCommand(...args))

  /**
   * @see https://redis.io/commands/sinterstore
   */
  sinterstore = (...args: CommandArgs<typeof SInterStoreCommand>) =>
    this.chain(new SInterStoreCommand(...args))

  /**
   * @see https://redis.io/commands/sismember
   */
  sismember = <TData>(key: string, member: TData) =>
    this.chain(new SIsMemberCommand<TData>(key, member))

  /**
   * @see https://redis.io/commands/smembers
   */
  smembers = (...args: CommandArgs<typeof SMembersCommand>) =>
    this.chain(new SMembersCommand(...args))

  /**
   * @see https://redis.io/commands/smove
   */
  smove = <TData>(source: string, destination: string, member: TData) =>
    this.chain(new SMoveCommand<TData>(source, destination, member))

  /**
   * @see https://redis.io/commands/spop
   */
  spop = <TData>(...args: CommandArgs<typeof SPopCommand>) =>
    this.chain(new SPopCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/srandmember
   */
  srandmember = <TData>(...args: CommandArgs<typeof SRandMemberCommand>) =>
    this.chain(new SRandMemberCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/srem
   */
  srem = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    this.chain(new SRemCommand<TData>(key, ...members))

  /**
   * @see https://redis.io/commands/sscan
   */
  sscan = (...args: CommandArgs<typeof SScanCommand>) => this.chain(new SScanCommand(...args))

  /**
   * @see https://redis.io/commands/strlen
   */
  strlen = (...args: CommandArgs<typeof StrLenCommand>) => this.chain(new StrLenCommand(...args))

  /**
   * @see https://redis.io/commands/sunion
   */
  sunion = (...args: CommandArgs<typeof SUnionCommand>) => this.chain(new SUnionCommand(...args))

  /**
   * @see https://redis.io/commands/sunionstore
   */
  sunionstore = (...args: CommandArgs<typeof SUnionStoreCommand>) =>
    this.chain(new SUnionStoreCommand(...args))

  /**
   * @see https://redis.io/commands/time
   */
  time = () => this.chain(new TimeCommand())

  /**
   * @see https://redis.io/commands/touch
   */
  touch = (...args: CommandArgs<typeof TouchCommand>) => this.chain(new TouchCommand(...args))

  /**
   * @see https://redis.io/commands/ttl
   */
  ttl = (...args: CommandArgs<typeof TtlCommand>) => this.chain(new TtlCommand(...args))

  /**
   * @see https://redis.io/commands/type
   */
  type = (...args: CommandArgs<typeof TypeCommand>) => this.chain(new TypeCommand(...args))

  /**
   * @see https://redis.io/commands/unlink
   */
  unlink = (...args: CommandArgs<typeof UnlinkCommand>) => this.chain(new UnlinkCommand(...args))

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
      return this.chain(
        new ZAddCommand<TData>(args[0], args[1] as ScoreMember<TData>, ...(args.slice(2) as any)),
      )
    }

    return this.chain(new ZAddCommand<TData>(args[0], args[1] as any, ...(args.slice(2) as any)))
  }
  /**
   * @see https://redis.io/commands/zcard
   */
  zcard = (...args: CommandArgs<typeof ZCardCommand>) => this.chain(new ZCardCommand(...args))

  /**
   * @see https://redis.io/commands/zcount
   */
  zcount = (...args: CommandArgs<typeof ZCountCommand>) => this.chain(new ZCountCommand(...args))

  /**
   * @see https://redis.io/commands/zincrby
   */
  zincrby = <TData>(key: string, increment: number, member: TData) =>
    this.chain(new ZIncrByComand<TData>(key, increment, member))

  /**
   * @see https://redis.io/commands/zinterstore
   */
  zinterstore = (...args: CommandArgs<typeof ZInterStoreCommand>) =>
    this.chain(new ZInterStoreCommand(...args))

  /**
   * @see https://redis.io/commands/zlexcount
   */
  zlexcount = (...args: CommandArgs<typeof ZLexCountCommand>) =>
    this.chain(new ZLexCountCommand(...args))

  /**
   * @see https://redis.io/commands/zpopmax
   */
  zpopmax = <TData>(...args: CommandArgs<typeof ZPopMaxCommand>) =>
    this.chain(new ZPopMaxCommand<TData>(...args))

  /**
   * @see https://redis.io/commands/zpopmin
   */
  zpopmin = <TData>(...args: CommandArgs<typeof ZPopMinCommand>) =>
    this.chain(new ZPopMinCommand<TData>(...args))

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
  ) => this.chain(new ZRangeCommand<TData>(args[0], args[1] as any, args[2] as any, args[3]))

  /**
   * @see https://redis.io/commands/zrank
   */
  zrank = <TData>(key: string, member: TData) => this.chain(new ZRankCommand<TData>(key, member))

  /**
   * @see https://redis.io/commands/zrem
   */
  zrem = <TData>(key: string, ...members: NonEmptyArray<TData>) =>
    this.chain(new ZRemCommand<TData>(key, ...members))

  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  zremrangebylex = (...args: CommandArgs<typeof ZRemRangeByLexCommand>) =>
    this.chain(new ZRemRangeByLexCommand(...args))

  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  zremrangebyrank = (...args: CommandArgs<typeof ZRemRangeByRankCommand>) =>
    this.chain(new ZRemRangeByRankCommand(...args))

  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  zremrangebyscore = (...args: CommandArgs<typeof ZRemRangeByScoreCommand>) =>
    this.chain(new ZRemRangeByScoreCommand(...args))

  /**
   * @see https://redis.io/commands/zrevrank
   */
  zrevrank = <TData>(key: string, member: TData) =>
    this.chain(new ZRevRankCommand<TData>(key, member))

  /**
   * @see https://redis.io/commands/zscan
   */
  zscan = (...args: CommandArgs<typeof ZScanCommand>) => this.chain(new ZScanCommand(...args))

  /**
   * @see https://redis.io/commands/zscore
   */
  zscore = <TData>(key: string, member: TData) => this.chain(new ZScoreCommand<TData>(key, member))

  /**
   * @see https://redis.io/commands/zunionstore
   */
  zunionstore = (...args: CommandArgs<typeof ZUnionStoreCommand>) =>
    this.chain(new ZUnionStoreCommand(...args))
}
