import { NonEmptyArray } from "./types"
import { Command } from "./commands/command"
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
import { HttpClient } from "./http"
import { CommandArgs } from "./types"
import { UpstashError } from "./error"
import { UpstashResponse } from "./http"
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
  public async exec<TCommandResults extends unknown[] = unknown[]>(): Promise<TCommandResults> {
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
  public append(...args: CommandArgs<typeof AppendCommand>): this {
    return this.chain(new AppendCommand(...args))
  }

  /**
   * @see https://redis.io/commands/bitcount
   */
  public bitcount(...args: CommandArgs<typeof BitCountCommand>): this {
    return this.chain(new BitCountCommand(...args))
  }

  /**
   * @see https://redis.io/commands/bitop
   */
  public bitop(
    op: "and" | "or" | "xor",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ): this
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public bitop(op: "not", destinationKey: string, sourceKey: string): this

  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public bitop(
    op: "and" | "or" | "xor" | "not",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ): this {
    return this.chain(new BitOpCommand(op as any, destinationKey, sourceKey, ...sourceKeys))
  }

  /**
   * @see https://redis.io/commands/bitpos
   */
  public bitpos(...args: CommandArgs<typeof BitPosCommand>): this {
    return this.chain(new BitPosCommand(...args))
  }

  /**
   * @see https://redis.io/commands/dbsize
   */
  public dbsize(): this {
    return this.chain(new DBSizeCommand())
  }

  /**
   * @see https://redis.io/commands/decr
   */
  public decr(...args: CommandArgs<typeof DecrCommand>): this {
    return this.chain(new DecrCommand(...args))
  }

  /**
   * @see https://redis.io/commands/decrby
   */
  public decrby(...args: CommandArgs<typeof DecrByCommand>): this {
    return this.chain(new DecrByCommand(...args))
  }

  /**
   * @see https://redis.io/commands/del
   */
  public del(...args: CommandArgs<typeof DelCommand>): this {
    return this.chain(new DelCommand(...args))
  }

  /**
   * @see https://redis.io/commands/echo
   */
  public echo(...args: CommandArgs<typeof EchoCommand>): this {
    return this.chain(new EchoCommand(...args))
  }

  /**
   * @see https://redis.io/commands/exists
   */
  public exists(...args: CommandArgs<typeof ExistsCommand>): this {
    return this.chain(new ExistsCommand(...args))
  }

  /**
   * @see https://redis.io/commands/expire
   */
  public expire(...args: CommandArgs<typeof ExpireCommand>): this {
    return this.chain(new ExpireCommand(...args))
  }

  /**
   * @see https://redis.io/commands/expireat
   */
  public expireat(...args: CommandArgs<typeof ExpireAtCommand>): this {
    return this.chain(new ExpireAtCommand(...args))
  }

  /**
   * @see https://redis.io/commands/flushall
   */
  public flushall(...args: CommandArgs<typeof FlushAllCommand>): this {
    return this.chain(new FlushAllCommand(...args))
  }

  /**
   * @see https://redis.io/commands/flushdb
   */
  public flushdb(...args: CommandArgs<typeof FlushDBCommand>): this {
    return this.chain(new FlushDBCommand(...args))
  }

  /**
   * @see https://redis.io/commands/get
   */
  public get<TData>(...args: CommandArgs<typeof GetCommand>): this {
    return this.chain(new GetCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/getbit
   */
  public getbit(...args: CommandArgs<typeof GetBitCommand>): this {
    return this.chain(new GetBitCommand(...args))
  }

  /**
   * @see https://redis.io/commands/getrange
   */
  public getrange(...args: CommandArgs<typeof GetRangeCommand>): this {
    return this.chain(new GetRangeCommand(...args))
  }

  /**
   * @see https://redis.io/commands/getset
   */
  public getset<TData>(key: string, value: TData): this {
    return this.chain(new GetSetCommand<TData>(key, value))
  }

  /**
   * @see https://redis.io/commands/hdel
   */
  public hdel(...args: CommandArgs<typeof HDelCommand>): this {
    return this.chain(new HDelCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hexists
   */
  public hexists(...args: CommandArgs<typeof HExistsCommand>): this {
    return this.chain(new HExistsCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hget
   */
  public hget<TData>(...args: CommandArgs<typeof HGetCommand>): this {
    return this.chain(new HGetCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/hgetall
   */
  public hgetall<TData extends Record<string, unknown>>(
    ...args: CommandArgs<typeof HGetAllCommand>
  ): this {
    return this.chain(new HGetAllCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/hincrby
   */
  public hincrby(...args: CommandArgs<typeof HIncrByCommand>): this {
    return this.chain(new HIncrByCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hincrbyfloat
   */
  public hincrbyfloat(...args: CommandArgs<typeof HIncrByFloatCommand>): this {
    return this.chain(new HIncrByFloatCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hkeys
   */
  public hkeys(...args: CommandArgs<typeof HKeysCommand>): this {
    return this.chain(new HKeysCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hlen
   */
  public hlen(...args: CommandArgs<typeof HLenCommand>): this {
    return this.chain(new HLenCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hmget
   */
  public hmget<TData extends Record<string, unknown>>(
    ...args: CommandArgs<typeof HMGetCommand>
  ): this {
    return this.chain(new HMGetCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/hmset
   */
  public hmset<TData>(key: string, kv: { [field: string]: TData }): this {
    return this.chain(new HMSetCommand(key, kv))
  }

  /**
   * @see https://redis.io/commands/hscan
   */
  public hscan(...args: CommandArgs<typeof HScanCommand>): this {
    return this.chain(new HScanCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hset
   */
  public hset<TData>(key: string, field: string, value: TData): this {
    return this.chain(new HSetCommand<TData>(key, field, value))
  }

  /**
   * @see https://redis.io/commands/hsetnx
   */
  public hsetnx<TData>(key: string, field: string, value: TData): this {
    return this.chain(new HSetNXCommand<TData>(key, field, value))
  }

  /**
   * @see https://redis.io/commands/hstrlen
   */
  public hstrlen(...args: CommandArgs<typeof HStrLenCommand>): this {
    return this.chain(new HStrLenCommand(...args))
  }

  /**
   * @see https://redis.io/commands/hvals
   */
  public hvals(...args: CommandArgs<typeof HValsCommand>): this {
    return this.chain(new HValsCommand(...args))
  }

  /**
   * @see https://redis.io/commands/incr
   */
  public incr(...args: CommandArgs<typeof IncrCommand>): this {
    return this.chain(new IncrCommand(...args))
  }

  /**
   * @see https://redis.io/commands/incrby
   */
  public incrby(...args: CommandArgs<typeof IncrByCommand>): this {
    return this.chain(new IncrByCommand(...args))
  }

  /**
   * @see https://redis.io/commands/incrbyfloat
   */
  public incrbyfloat(...args: CommandArgs<typeof IncrByFloatCommand>): this {
    return this.chain(new IncrByFloatCommand(...args))
  }

  /**
   * @see https://redis.io/commands/keys
   */
  public keys(...args: CommandArgs<typeof KeysCommand>): this {
    return this.chain(new KeysCommand(...args))
  }

  /**
   * @see https://redis.io/commands/lindex
   */
  public lindex(...args: CommandArgs<typeof LIndexCommand>): this {
    return this.chain(new LIndexCommand(...args))
  }

  /**
   * @see https://redis.io/commands/linsert
   */
  public linsert<TData>(
    key: string,
    direction: "before" | "after",
    pivot: TData,
    value: TData,
  ): this {
    return this.chain(new LInsertCommand<TData>(key, direction, pivot, value))
  }

  /**
   * @see https://redis.io/commands/llen
   */
  public llen(...args: CommandArgs<typeof LLenCommand>): this {
    return this.chain(new LLenCommand(...args))
  }

  /**
   * @see https://redis.io/commands/lpop
   */
  public lpop<TData>(...args: CommandArgs<typeof LPopCommand>): this {
    return this.chain(new LPopCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/lpush
   */
  public lpush<TData>(key: string, ...elements: NonEmptyArray<TData>): this {
    return this.chain(new LPushCommand<TData>(key, ...elements))
  }

  /**
   * @see https://redis.io/commands/lpushx
   */
  public lpushx<TData>(key: string, ...elements: NonEmptyArray<TData>): this {
    return this.chain(new LPushXCommand<TData>(key, ...elements))
  }

  /**
   * @see https://redis.io/commands/lrange
   */
  public lrange<TResult = string>(...args: CommandArgs<typeof LRangeCommand>): this {
    return this.chain(new LRangeCommand<TResult>(...args))
  }

  /**
   * @see https://redis.io/commands/lrem
   */
  public lrem<TData>(key: string, count: number, value: TData): this {
    return this.chain(new LRemCommand(key, count, value))
  }

  /**
   * @see https://redis.io/commands/lset
   */
  public lset<TData>(key: string, value: TData, index: number): this {
    return this.chain(new LSetCommand(key, value, index))
  }

  /**
   * @see https://redis.io/commands/ltrim
   */
  public ltrim(...args: CommandArgs<typeof LTrimCommand>): this {
    return this.chain(new LTrimCommand(...args))
  }

  /**
   * @see https://redis.io/commands/mget
   */
  public mget<TData extends [unknown, ...unknown[]]>(
    ...args: CommandArgs<typeof MGetCommand>
  ): this {
    return this.chain(new MGetCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/mset
   */
  public mset<TData>(kv: { [key: string]: TData }): this {
    return this.chain(new MSetCommand<TData>(kv))
  }

  /**
   * @see https://redis.io/commands/msetnx
   */
  public msetnx<TData>(kv: { [key: string]: TData }): this {
    return this.chain(new MSetNXCommand<TData>(kv))
  }

  /**
   * @see https://redis.io/commands/persist
   */
  public persist(...args: CommandArgs<typeof PersistCommand>): this {
    return this.chain(new PersistCommand(...args))
  }

  /**
   * @see https://redis.io/commands/pexpire
   */
  public pexpire(...args: CommandArgs<typeof PExpireCommand>): this {
    return this.chain(new PExpireCommand(...args))
  }

  /**
   * @see https://redis.io/commands/pexpireat
   */
  public pexpireat(...args: CommandArgs<typeof PExpireAtCommand>): this {
    return this.chain(new PExpireAtCommand(...args))
  }

  /**
   * @see https://redis.io/commands/ping
   */
  public ping(...args: CommandArgs<typeof PingCommand>): this {
    return this.chain(new PingCommand(...args))
  }

  /**
   * @see https://redis.io/commands/psetex
   */
  public psetex<TData>(key: string, ttl: number, value: TData): this {
    return this.chain(new PSetEXCommand<TData>(key, ttl, value))
  }

  /**
   * @see https://redis.io/commands/pttl
   */
  public pttl(...args: CommandArgs<typeof PTtlCommand>): this {
    return this.chain(new PTtlCommand(...args))
  }

  /**
   * @see https://redis.io/commands/randomkey
   */
  public randomkey(): this {
    return this.chain(new RandomKeyCommand())
  }

  /**
   * @see https://redis.io/commands/rename
   */
  public rename(...args: CommandArgs<typeof RenameCommand>): this {
    return this.chain(new RenameCommand(...args))
  }

  /**
   * @see https://redis.io/commands/renamenx
   */
  public renamenx(...args: CommandArgs<typeof RenameNXCommand>): this {
    return this.chain(new RenameNXCommand(...args))
  }

  /**
   * @see https://redis.io/commands/rpop
   */
  public rpop<TData = string>(...args: CommandArgs<typeof RPopCommand>): this {
    return this.chain(new RPopCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/rpush
   */
  public rpush<TData>(key: string, ...elements: NonEmptyArray<TData>): this {
    return this.chain(new RPushCommand(key, ...elements))
  }

  /**
   * @see https://redis.io/commands/rpushx
   */
  public rpushx<TData>(key: string, ...elements: NonEmptyArray<TData>): this {
    return this.chain(new RPushXCommand(key, ...elements))
  }

  /**
   * @see https://redis.io/commands/sadd
   */
  public sadd<TData>(key: string, ...members: NonEmptyArray<TData>): this {
    return this.chain(new SAddCommand<TData>(key, ...members))
  }

  /**
   * @see https://redis.io/commands/scan
   */
  public scan(...args: CommandArgs<typeof ScanCommand>): this {
    return this.chain(new ScanCommand(...args))
  }

  /**
   * @see https://redis.io/commands/scard
   */
  public scard(...args: CommandArgs<typeof SCardCommand>): this {
    return this.chain(new SCardCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sdiff
   */
  public sdiff(...args: CommandArgs<typeof SDiffCommand>): this {
    return this.chain(new SDiffCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sdiffstore
   */
  public sdiffstore(...args: CommandArgs<typeof SDiffStoreCommand>): this {
    return this.chain(new SDiffStoreCommand(...args))
  }

  /**
   * @see https://redis.io/commands/set
   */
  public set<TData>(key: string, value: TData, opts?: SetCommandOptions): this {
    return this.chain(new SetCommand<TData>(key, value, opts))
  }

  /**
   * @see https://redis.io/commands/setbit
   */
  public setbit(...args: CommandArgs<typeof SetBitCommand>): this {
    return this.chain(new SetBitCommand(...args))
  }

  /**
   * @see https://redis.io/commands/setex
   */
  public setex<TData>(key: string, ttl: number, value: TData): this {
    return this.chain(new SetExCommand<TData>(key, ttl, value))
  }

  /**
   * @see https://redis.io/commands/setnx
   */
  public setnx<TData>(key: string, value: TData): this {
    return this.chain(new SetNxCommand<TData>(key, value))
  }

  /**
   * @see https://redis.io/commands/setrange
   */
  public setrange(...args: CommandArgs<typeof SetRangeCommand>): this {
    return this.chain(new SetRangeCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sinter
   */
  public sinter(...args: CommandArgs<typeof SInterCommand>): this {
    return this.chain(new SInterCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sinterstore
   */
  public sinterstore(...args: CommandArgs<typeof SInterStoreCommand>): this {
    return this.chain(new SInterStoreCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sismember
   */
  public sismember<TData>(key: string, member: TData): this {
    return this.chain(new SIsMemberCommand<TData>(key, member))
  }

  /**
   * @see https://redis.io/commands/smembers
   */
  public smembers(...args: CommandArgs<typeof SMembersCommand>): this {
    return this.chain(new SMembersCommand(...args))
  }

  /**
   * @see https://redis.io/commands/smove
   */
  public smove<TData>(source: string, destination: string, member: TData): this {
    return this.chain(new SMoveCommand<TData>(source, destination, member))
  }

  /**
   * @see https://redis.io/commands/spop
   */
  public spop<TData>(...args: CommandArgs<typeof SPopCommand>): this {
    return this.chain(new SPopCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/srandmember
   */
  public srandmember<TData>(...args: CommandArgs<typeof SRandMemberCommand>): this {
    return this.chain(new SRandMemberCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/srem
   */
  public srem<TData>(key: string, ...members: NonEmptyArray<TData>): this {
    return this.chain(new SRemCommand<TData>(key, ...members))
  }

  /**
   * @see https://redis.io/commands/sscan
   */
  public sscan(...args: CommandArgs<typeof SScanCommand>): this {
    return this.chain(new SScanCommand(...args))
  }

  /**
   * @see https://redis.io/commands/strlen
   */
  public strlen(...args: CommandArgs<typeof StrLenCommand>): this {
    return this.chain(new StrLenCommand(...args))
  }

  /**
   * @see https://redis.io/commands/sunion
   */
  public sunion(...args: CommandArgs<typeof SUnionCommand>): this {
    return this.chain(new SUnionCommand(...args))
  }
  /**
   * @see https://redis.io/commands/sunionstore
   */
  public sunionstore(...args: CommandArgs<typeof SUnionStoreCommand>): this {
    return this.chain(new SUnionStoreCommand(...args))
  }

  /**
   * @see https://redis.io/commands/time
   */
  public time(): this {
    return this.chain(new TimeCommand())
  }

  /**
   * @see https://redis.io/commands/touch
   */
  public touch(...args: CommandArgs<typeof TouchCommand>): this {
    return this.chain(new TouchCommand(...args))
  }

  /**
   * @see https://redis.io/commands/ttl
   */
  public ttl(...args: CommandArgs<typeof TtlCommand>): this {
    return this.chain(new TtlCommand(...args))
  }

  /**
   * @see https://redis.io/commands/type
   */
  public type(...args: CommandArgs<typeof TypeCommand>): this {
    return this.chain(new TypeCommand(...args))
  }

  /**
   * @see https://redis.io/commands/unlink
   */
  public unlink(...args: CommandArgs<typeof UnlinkCommand>): this {
    return this.chain(new UnlinkCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zadd
   */
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public zadd<TData>(
    key: string,
    scoreMember: ScoreMember<TData>,
    ...scoreMemberPairs: ScoreMember<TData>[]
  ): this
  // eslint-disable-next-line no-dupe-class-members,@typescript-eslint/no-unused-vars
  public zadd<TData>(
    key: string,
    opts: ZAddCommandOptions | ZAddCommandOptionsWithIncr,
    ...scoreMemberPairs: [ScoreMember<TData>, ...ScoreMember<TData>[]]
  ): this
  // eslint-disable-next-line no-dupe-class-members
  public zadd<TData>(
    key: string,
    arg1: ScoreMember<TData> | ZAddCommandOptions | ZAddCommandOptionsWithIncr,
    ...arg2: ScoreMember<TData>[]
  ): this {
    // if ("score" in arg1) {
    //   return this.chain(new ZAddCommand<TData>(key, arg1 as ScoreMember<TData>, ...arg2))
    // }
    return this.chain(new ZAddCommand<TData>(key, arg1 as any, ...arg2))
  }

  /**
   * @see https://redis.io/commands/zcard
   */
  public zcard(...args: CommandArgs<typeof ZCardCommand>): this {
    return this.chain(new ZCardCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zcount
   */
  public zcount(...args: CommandArgs<typeof ZCountCommand>): this {
    return this.chain(new ZCountCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zincrby
   */
  public zincrby<TData>(key: string, increment: number, member: TData): this {
    return this.chain(new ZIncrByComand<TData>(key, increment, member))
  }

  /**
   * @see https://redis.io/commands/zinterstore
   */
  public zinterstore(...args: CommandArgs<typeof ZInterStoreCommand>): this {
    return this.chain(new ZInterStoreCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zlexcount
   */
  public zlexcount(...args: CommandArgs<typeof ZLexCountCommand>): this {
    return this.chain(new ZLexCountCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zpopmax
   */
  public zpopmax<TData>(...args: CommandArgs<typeof ZPopMaxCommand>): this {
    return this.chain(new ZPopMaxCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/zpopmin
   */
  public zpopmin<TData>(...args: CommandArgs<typeof ZPopMinCommand>): this {
    return this.chain(new ZPopMinCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/zrange
   */
  public zrange<TData extends unknown[]>(...args: CommandArgs<typeof ZRangeCommand>): this {
    return this.chain(new ZRangeCommand<TData>(...args))
  }

  /**
   * @see https://redis.io/commands/zrank
   */
  public zrank<TData>(key: string, member: TData): this {
    return this.chain(new ZRankCommand<TData>(key, member))
  }

  /**
   * @see https://redis.io/commands/zrem
   */
  public zrem<TData>(key: string, ...members: NonEmptyArray<TData>): this {
    return this.chain(new ZRemCommand<TData>(key, ...members))
  }

  /**
   * @see https://redis.io/commands/zremrangebylex
   */
  public zremrangebylex(...args: CommandArgs<typeof ZRemRangeByLexCommand>): this {
    return this.chain(new ZRemRangeByLexCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zremrangebyrank
   */
  public zremrangebyrank(...args: CommandArgs<typeof ZRemRangeByRankCommand>): this {
    return this.chain(new ZRemRangeByRankCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zremrangebyscore
   */
  public zremrangebyscore(...args: CommandArgs<typeof ZRemRangeByScoreCommand>): this {
    return this.chain(new ZRemRangeByScoreCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zrevrank
   */
  public zrevrank<TData>(key: string, member: TData): this {
    return this.chain(new ZRevRankCommand<TData>(key, member))
  }

  /**
   * @see https://redis.io/commands/zscan
   */
  public zscan(...args: CommandArgs<typeof ZScanCommand>): this {
    return this.chain(new ZScanCommand(...args))
  }

  /**
   * @see https://redis.io/commands/zscore
   */
  public zscore<TData>(key: string, member: TData): this {
    return this.chain(new ZScoreCommand<TData>(key, member))
  }
  /**
   * @see https://redis.io/commands/zunionstore
   */
  public zunionstore(...args: CommandArgs<typeof ZUnionStoreCommand>): this {
    return this.chain(new ZUnionStoreCommand(...args))
  }
}
