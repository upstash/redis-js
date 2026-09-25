import type { Command, CommandOptions } from "./commands/command";
import { HRandFieldCommand } from "./commands/hrandfield";
import type {
  ScoreMember,
  SetCommandOptions,
  ZAddCommandOptions,
  ZRangeCommandOptions,
} from "./commands/mod";
import type { ArGrepOptions, ArMSetValues, ArOpOperation } from "./commands/mod";
import {
  AppendCommand,
  ArCountCommand,
  ArDelCommand,
  ArDelRangeCommand,
  ArGetCommand,
  ArGetRangeCommand,
  ArGrepCommand,
  ArInfoCommand,
  ArInsertCommand,
  ArLastItemsCommand,
  ArLenCommand,
  ArMGetCommand,
  ArMSetCommand,
  ArNextCommand,
  ArOpCommand,
  ArRingCommand,
  ArScanCommand,
  ArSeekCommand,
  ArSetCommand,
  BitCountCommand,
  BitFieldCommand,
  BitOpCommand,
  BitPosCommand,
  ClientSetInfoCommand,
  CopyCommand,
  DBSizeCommand,
  DecrByCommand,
  DecrCommand,
  DelCommand,
  EchoCommand,
  EvalROCommand,
  EvalCommand,
  EvalshaROCommand,
  EvalshaCommand,
  ExistsCommand,
  ExpireAtCommand,
  ExpireCommand,
  FCallCommand,
  FCallRoCommand,
  FlushAllCommand,
  FlushDBCommand,
  FunctionDeleteCommand,
  FunctionFlushCommand,
  FunctionListCommand,
  FunctionLoadCommand,
  FunctionStatsCommand,
  GeoAddCommand,
  GeoDistCommand,
  GeoHashCommand,
  GeoPosCommand,
  GeoSearchCommand,
  GeoSearchStoreCommand,
  GetBitCommand,
  GetCommand,
  GetDelCommand,
  GetExCommand,
  GetRangeCommand,
  GetSetCommand,
  HDelCommand,
  HExistsCommand,
  HExpireCommand,
  HExpireAtCommand,
  HExpireTimeCommand,
  HTtlCommand,
  HPExpireCommand,
  HPExpireAtCommand,
  HPExpireTimeCommand,
  HPTtlCommand,
  HPersistCommand,
  HGetAllCommand,
  HGetCommand,
  HGetDelCommand,
  HGetExCommand,
  HIncrByCommand,
  HIncrByFloatCommand,
  HKeysCommand,
  HLenCommand,
  HMGetCommand,
  HMSetCommand,
  HScanCommand,
  HSetCommand,
  HSetExCommand,
  HSetNXCommand,
  HStrLenCommand,
  HValsCommand,
  IncrByCommand,
  IncrByFloatCommand,
  IncrCommand,
  JsonArrAppendCommand,
  JsonArrIndexCommand,
  JsonArrInsertCommand,
  JsonArrLenCommand,
  JsonArrPopCommand,
  JsonArrTrimCommand,
  JsonClearCommand,
  JsonDelCommand,
  JsonForgetCommand,
  JsonGetCommand,
  JsonMergeCommand,
  JsonMGetCommand,
  JsonMSetCommand,
  JsonNumIncrByCommand,
  JsonNumMultByCommand,
  JsonObjKeysCommand,
  JsonObjLenCommand,
  JsonRespCommand,
  JsonSetCommand,
  JsonStrAppendCommand,
  JsonStrLenCommand,
  JsonToggleCommand,
  JsonTypeCommand,
  KeysCommand,
  LIndexCommand,
  LInsertCommand,
  LLenCommand,
  LMoveCommand,
  LPopCommand,
  LPosCommand,
  LPushCommand,
  LPushXCommand,
  LRangeCommand,
  LRemCommand,
  LSetCommand,
  LTrimCommand,
  LmPopCommand,
  MGetCommand,
  MSetCommand,
  MSetNXCommand,
  PExpireAtCommand,
  PExpireCommand,
  PSetEXCommand,
  PTtlCommand,
  PersistCommand,
  PfAddCommand,
  PfCountCommand,
  PfMergeCommand,
  PingCommand,
  PublishCommand,
  RPopCommand,
  RPushCommand,
  RPushXCommand,
  RandomKeyCommand,
  RenameCommand,
  RenameNXCommand,
  SAddCommand,
  SCardCommand,
  SDiffCommand,
  SDiffStoreCommand,
  SInterCommand,
  SInterCardCommand,
  SInterStoreCommand,
  SIsMemberCommand,
  SMIsMemberCommand,
  SMembersCommand,
  SMoveCommand,
  SPopCommand,
  SRandMemberCommand,
  SRemCommand,
  SScanCommand,
  SUnionCommand,
  SUnionStoreCommand,
  ScanCommand,
  ScriptExistsCommand,
  ScriptFlushCommand,
  ScriptLoadCommand,
  SetBitCommand,
  SetCommand,
  SetExCommand,
  SetNxCommand,
  SetRangeCommand,
  StrLenCommand,
  TimeCommand,
  TouchCommand,
  TtlCommand,
  TypeCommand,
  UnlinkCommand,
  XAckCommand,
  XAckDelCommand,
  XAddCommand,
  XAutoClaim,
  XClaimCommand,
  XDelCommand,
  XDelExCommand,
  XGroupCommand,
  XInfoCommand,
  XLenCommand,
  XPendingCommand,
  XRangeCommand,
  XReadCommand,
  XReadGroupCommand,
  XRevRangeCommand,
  XTrimCommand,
  ZAddCommand,
  ZCardCommand,
  ZCountCommand,
  ZIncrByCommand,
  ZInterStoreCommand,
  ZLexCountCommand,
  ZPopMaxCommand,
  ZPopMinCommand,
  ZRangeCommand,
  ZRankCommand,
  ZRemCommand,
  ZRemRangeByLexCommand,
  ZRemRangeByRankCommand,
  ZRemRangeByScoreCommand,
  ZRevRankCommand,
  ZScanCommand,
  ZScoreCommand,
  ZUnionCommand,
  ZUnionStoreCommand,
} from "./commands/mod";
import { ZDiffStoreCommand } from "./commands/zdiffstore";
import { ZMScoreCommand } from "./commands/zmscore";
import { UpstashError } from "./error";
import type { Requester, UpstashResponse } from "./http";
import type { CommandArgs } from "./types";

// Given a tuple of commands, returns a tuple of the response data of each command
type InferResponseData<T extends unknown[]> = {
  [K in keyof T]: T[K] extends Command<any, infer TData> ? TData : unknown;
};

interface ExecMethod<TCommands extends Command<any, any>[]> {
  /**
   * Send the pipeline request to upstash.
   *
   * Returns an array with the results of all pipelined commands.
   *
   * If all commands are statically chained from start to finish, types are inferred. You can still define a return type manually if necessary though:
   * ```ts
   * const p = redis.pipeline()
   * p.get("key")
   * const result = p.exec<[{ greeting: string }]>()
   * ```
   *
   * If one of the commands get an error, the whole pipeline fails. Alternatively, you can set the keepErrors option to true in order to get the errors individually.
   *
   * If keepErrors is set to true, a list of objects is returned where each object corresponds to a command and is of type: `{ result: unknown, error?: string }`.
   *
   * ```ts
   * const p = redis.pipeline()
   * p.get("key")
   *
   * const result = await p.exec({ keepErrors: true });
   * const getResult = result[0].result
   * const getError = result[0].error
   * ```
   */
  <
    TCommandResults extends unknown[] = [] extends TCommands
      ? unknown[]
      : InferResponseData<TCommands>,
  >(): Promise<TCommandResults>;
  <
    TCommandResults extends unknown[] = [] extends TCommands
      ? unknown[]
      : InferResponseData<TCommands>,
  >(options: {
    keepErrors: true;
  }): Promise<{ [K in keyof TCommandResults]: UpstashResponse<TCommandResults[K]> }>;
}

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
 * **Examples:**
 *
 * ```ts
 *  const p = redis.pipeline() // or redis.multi()
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
 * Return types are inferred if all commands are chained, but you can still
 * override the response type manually:
 * ```ts
 *  redis.pipeline()
 *   .set("key", { greeting: "hello"})
 *   .get("key")
 *   .exec<["OK", { greeting: string } ]>()
 *
 * ```
 */
export class Pipeline<TCommands extends Command<any, any>[] = []> {
  private client: Requester;
  private commands: TCommands;
  private commandOptions?: CommandOptions<any, any>;
  private multiExec: boolean;

  constructor(opts: {
    client: Requester;
    commandOptions?: CommandOptions<any, any>;
    multiExec?: boolean;
  }) {
    this.client = opts.client;

    this.commands = [] as unknown as TCommands; // the TCommands generic in the class definition is only used for carrying through chained command types and should never be explicitly set when instantiating the class
    this.commandOptions = opts.commandOptions;
    this.multiExec = opts.multiExec ?? false;

    if (this.commandOptions?.latencyLogging) {
      const originalExec = this.exec.bind(this);
      this.exec = async <
        TCommandResults extends unknown[] = [] extends TCommands
          ? unknown[]
          : InferResponseData<TCommands>,
      >(options?: {
        keepErrors: true;
      }): Promise<TCommandResults> => {
        const start = performance.now();
        const result = await (options ? originalExec(options) : originalExec());
        const end = performance.now();
        const loggerResult = (end - start).toFixed(2);
        // eslint-disable-next-line no-console
        console.log(
          `Latency for \u001B[38;2;19;185;39m${
            this.multiExec ? ["MULTI-EXEC"] : ["PIPELINE"].toString().toUpperCase()
          }\u001B[0m: \u001B[38;2;0;255;255m${loggerResult} ms\u001B[0m`
        );
        return result as TCommandResults;
      };
    }
  }

  exec: ExecMethod<TCommands> = async (options?: { keepErrors: true }) => {
    if (this.commands.length === 0) {
      throw new Error("Pipeline is empty");
    }
    const path = this.multiExec ? ["multi-exec"] : ["pipeline"];

    const res = (await this.client.request({
      path,
      body: Object.values(this.commands).map((c) => c.command),
    })) as UpstashResponse<any>[];

    return options?.keepErrors
      ? res.map(({ error, result }, i) => {
          return {
            error: error,
            result: this.commands[i].deserialize(result),
          };
        })
      : res.map(({ error, result }, i) => {
          if (error) {
            throw new UpstashError(
              `Command ${i + 1} [ ${this.commands[i].command[0]} ] failed: ${error}`
            );
          }

          return this.commands[i].deserialize(result);
        });
  };

  /**
   * Returns the length of pipeline before the execution
   */
  length(): number {
    return this.commands.length;
  }

  /**
   * Pushes a command into the pipeline and returns a chainable instance of the
   * pipeline
   */
  private chain<T>(command: Command<any, T>): Pipeline<[...TCommands, Command<any, T>]> {
    this.commands.push(command);
    return this as any; // TS thinks we're returning Pipeline<[]> here, because we're not creating a new instance of the class, hence the cast
  }

  /**
   * @see https://redis.io/commands/append
   * @see node_modules/@upstash/redis/docs/commands/string/append.mdx
   */
  append = (...args: CommandArgs<typeof AppendCommand>) =>
    this.chain(new AppendCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arcount
   * @see node_modules/@upstash/redis/docs/commands/array/arcount.mdx
   */
  arcount = (...args: CommandArgs<typeof ArCountCommand>) =>
    this.chain(new ArCountCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/ardel
   * @see node_modules/@upstash/redis/docs/commands/array/ardel.mdx
   */
  ardel = (...args: CommandArgs<typeof ArDelCommand>) =>
    this.chain(new ArDelCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/ardelrange
   * @see node_modules/@upstash/redis/docs/commands/array/ardelrange.mdx
   */
  ardelrange = (...args: CommandArgs<typeof ArDelRangeCommand>) =>
    this.chain(new ArDelRangeCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arget
   * @see node_modules/@upstash/redis/docs/commands/array/arget.mdx
   */
  arget = <TData = string>(...args: CommandArgs<typeof ArGetCommand>) =>
    this.chain(new ArGetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/argetrange
   * @see node_modules/@upstash/redis/docs/commands/array/argetrange.mdx
   */
  argetrange = <TData = string>(...args: CommandArgs<typeof ArGetRangeCommand>) =>
    this.chain(new ArGetRangeCommand<TData>(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/argrep
   * @see node_modules/@upstash/redis/docs/commands/array/argrep.mdx
   */
  argrep = <TData = string, TOpts extends ArGrepOptions = ArGrepOptions>(
    key: string,
    start: number | string,
    end: number | string,
    opts: TOpts
  ) => this.chain(new ArGrepCommand<TData, TOpts>([key, start, end, opts], this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arinfo
   * @see node_modules/@upstash/redis/docs/commands/array/arinfo.mdx
   */
  arinfo = (...args: CommandArgs<typeof ArInfoCommand>) =>
    this.chain(new ArInfoCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arinsert
   * @see node_modules/@upstash/redis/docs/commands/array/arinsert.mdx
   */
  arinsert = <TData>(key: string, ...values: TData[]) =>
    this.chain(new ArInsertCommand<TData>([key, ...values], this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arlastitems
   * @see node_modules/@upstash/redis/docs/commands/array/arlastitems.mdx
   */
  arlastitems = <TData = string>(...args: CommandArgs<typeof ArLastItemsCommand>) =>
    this.chain(new ArLastItemsCommand<TData>(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arlen
   * @see node_modules/@upstash/redis/docs/commands/array/arlen.mdx
   */
  arlen = (...args: CommandArgs<typeof ArLenCommand>) =>
    this.chain(new ArLenCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/armget
   * @see node_modules/@upstash/redis/docs/commands/array/armget.mdx
   */
  armget = <TData = string>(...args: CommandArgs<typeof ArMGetCommand>) =>
    this.chain(new ArMGetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/armset
   * @see node_modules/@upstash/redis/docs/commands/array/armset.mdx
   */
  armset = <TData>(key: string, values: ArMSetValues<TData>) =>
    this.chain(new ArMSetCommand<TData>([key, values], this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arnext
   * @see node_modules/@upstash/redis/docs/commands/array/arnext.mdx
   */
  arnext = (...args: CommandArgs<typeof ArNextCommand>) =>
    this.chain(new ArNextCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arop
   * @see node_modules/@upstash/redis/docs/commands/array/arop.mdx
   */
  arop = <TData = string>(
    key: string,
    start: number | string,
    end: number | string,
    operation: ArOpOperation<TData>
  ) => this.chain(new ArOpCommand<TData>([key, start, end, operation], this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arring
   * @see node_modules/@upstash/redis/docs/commands/array/arring.mdx
   */
  arring = <TData>(key: string, size: number, ...values: TData[]) =>
    this.chain(new ArRingCommand<TData>([key, size, ...values], this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arscan
   * @see node_modules/@upstash/redis/docs/commands/array/arscan.mdx
   */
  arscan = <TData = string>(...args: CommandArgs<typeof ArScanCommand>) =>
    this.chain(new ArScanCommand<TData>(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arseek
   * @see node_modules/@upstash/redis/docs/commands/array/arseek.mdx
   */
  arseek = (...args: CommandArgs<typeof ArSeekCommand>) =>
    this.chain(new ArSeekCommand(args, this.commandOptions));

  /**
   * @see https://upstash.com/docs/redis/commands/array/arset
   * @see node_modules/@upstash/redis/docs/commands/array/arset.mdx
   */
  arset = <TData>(key: string, index: number | string, ...values: TData[]) =>
    this.chain(new ArSetCommand<TData>([key, index, ...values], this.commandOptions));

  /**
   * @see https://redis.io/commands/bitcount
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitcount.mdx
   */
  bitcount = (...args: CommandArgs<typeof BitCountCommand>) =>
    this.chain(new BitCountCommand(args, this.commandOptions));

  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.pipeline()
   *   .bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [[0, 1]]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = (...args: CommandArgs<typeof BitFieldCommand>) =>
    new BitFieldCommand(args, this.client, this.commandOptions, this.chain.bind(this));

  /**
   * @see https://redis.io/commands/bitop
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitop.mdx
   */
  bitop: {
    (
      op: "and" | "or" | "xor",
      destinationKey: string,
      sourceKey: string,
      ...sourceKeys: string[]
    ): Pipeline<[...TCommands, BitOpCommand]>;
    (op: "not", destinationKey: string, sourceKey: string): Pipeline<[...TCommands, BitOpCommand]>;
    (
      op: "diff" | "diff1" | "andor",
      destinationKey: string,
      x: string,
      ...y: string[]
    ): Pipeline<[...TCommands, BitOpCommand]>;
    (
      op: "one",
      destinationKey: string,
      ...sourceKeys: string[]
    ): Pipeline<[...TCommands, BitOpCommand]>;
  } = (
    op: "and" | "or" | "xor" | "not" | "diff" | "diff1" | "andor" | "one",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ) =>
    this.chain(
      new BitOpCommand([op as any, destinationKey, sourceKey, ...sourceKeys], this.commandOptions)
    );

  /**
   * @see https://redis.io/commands/bitpos
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitpos.mdx
   */
  bitpos = (...args: CommandArgs<typeof BitPosCommand>) =>
    this.chain(new BitPosCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/client-setinfo
   * @see node_modules/@upstash/redis/docs/commands/connection/client_setinfo.mdx
   */
  clientSetinfo = (...args: CommandArgs<typeof ClientSetInfoCommand>) =>
    this.chain(new ClientSetInfoCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/copy
   */
  copy = (...args: CommandArgs<typeof CopyCommand>) =>
    this.chain(new CopyCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zdiffstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zdiffstore.mdx
   */
  zdiffstore = (...args: CommandArgs<typeof ZDiffStoreCommand>) =>
    this.chain(new ZDiffStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/dbsize
   * @see node_modules/@upstash/redis/docs/commands/server/dbsize.mdx
   */
  dbsize = () => this.chain(new DBSizeCommand(this.commandOptions));

  /**
   * @see https://redis.io/commands/decr
   * @see node_modules/@upstash/redis/docs/commands/string/decr.mdx
   */
  decr = (...args: CommandArgs<typeof DecrCommand>) =>
    this.chain(new DecrCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/decrby
   * @see node_modules/@upstash/redis/docs/commands/string/decrby.mdx
   */
  decrby = (...args: CommandArgs<typeof DecrByCommand>) =>
    this.chain(new DecrByCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/del
   * @see node_modules/@upstash/redis/docs/commands/generic/del.mdx
   */
  del = (...args: CommandArgs<typeof DelCommand>) =>
    this.chain(new DelCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/echo
   * @see node_modules/@upstash/redis/docs/commands/auth/echo.mdx
   */
  echo = (...args: CommandArgs<typeof EchoCommand>) =>
    this.chain(new EchoCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/eval_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval_ro.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalRo = <TArgs extends unknown[], TData = unknown>(
    ...args: [script: string, keys: string[], args: TArgs]
  ) => this.chain(new EvalROCommand<TArgs, TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/eval
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  eval = <TArgs extends unknown[], TData = unknown>(
    ...args: [script: string, keys: string[], args: TArgs]
  ) => this.chain(new EvalCommand<TArgs, TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/evalsha_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha_ro.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalshaRo = <TArgs extends unknown[], TData = unknown>(
    ...args: [sha1: string, keys: string[], args: TArgs]
  ) => this.chain(new EvalshaROCommand<TArgs, TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/evalsha
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalsha = <TArgs extends unknown[], TData = unknown>(
    ...args: [sha1: string, keys: string[], args: TArgs]
  ) => this.chain(new EvalshaCommand<TArgs, TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/exists
   * @see node_modules/@upstash/redis/docs/commands/generic/exists.mdx
   */
  exists = (...args: CommandArgs<typeof ExistsCommand>) =>
    this.chain(new ExistsCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/expire
   * @see node_modules/@upstash/redis/docs/commands/generic/expire.mdx
   */
  expire = (...args: CommandArgs<typeof ExpireCommand>) =>
    this.chain(new ExpireCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/expireat
   * @see node_modules/@upstash/redis/docs/commands/generic/expireat.mdx
   */
  expireat = (...args: CommandArgs<typeof ExpireAtCommand>) =>
    this.chain(new ExpireAtCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/flushall
   * @see node_modules/@upstash/redis/docs/commands/server/flushall.mdx
   */
  flushall = (args?: CommandArgs<typeof FlushAllCommand>) =>
    this.chain(new FlushAllCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/flushdb
   * @see node_modules/@upstash/redis/docs/commands/server/flushdb.mdx
   */
  flushdb = (...args: CommandArgs<typeof FlushDBCommand>) =>
    this.chain(new FlushDBCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = <TData>(...args: CommandArgs<typeof GeoAddCommand<TData>>) =>
    this.chain(new GeoAddCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = <TData>(...args: CommandArgs<typeof GeoDistCommand<TData>>) =>
    this.chain(new GeoDistCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = <TData>(...args: CommandArgs<typeof GeoPosCommand<TData>>) =>
    this.chain(new GeoPosCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = <TData>(...args: CommandArgs<typeof GeoHashCommand<TData>>) =>
    this.chain(new GeoHashCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = <TData>(...args: CommandArgs<typeof GeoSearchCommand<TData>>) =>
    this.chain(new GeoSearchCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = <TData>(...args: CommandArgs<typeof GeoSearchStoreCommand<TData>>) =>
    this.chain(new GeoSearchStoreCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/get
   * @see node_modules/@upstash/redis/docs/commands/string/get.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  get = <TData>(...args: CommandArgs<typeof GetCommand>) =>
    this.chain(new GetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/getbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/getbit.mdx
   */
  getbit = (...args: CommandArgs<typeof GetBitCommand>) =>
    this.chain(new GetBitCommand(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getdel
   * @see node_modules/@upstash/redis/docs/commands/string/getdel.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  getdel = <TData>(...args: CommandArgs<typeof GetDelCommand>) =>
    this.chain(new GetDelCommand<TData>(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getex
   */
  getex = <TData>(...args: CommandArgs<typeof GetExCommand>) =>
    this.chain(new GetExCommand<TData>(args, this.commandOptions));
  /**
   * @see https://redis.io/commands/getrange
   * @see node_modules/@upstash/redis/docs/commands/string/getrange.mdx
   */
  getrange = (...args: CommandArgs<typeof GetRangeCommand>) =>
    this.chain(new GetRangeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/getset
   * @see node_modules/@upstash/redis/docs/commands/string/getset.mdx
   */
  getset = <TData>(key: string, value: TData) =>
    this.chain(new GetSetCommand<TData>([key, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/hdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hdel.mdx
   */
  hdel = (...args: CommandArgs<typeof HDelCommand>) =>
    this.chain(new HDelCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hexists
   * @see node_modules/@upstash/redis/docs/commands/hash/hexists.mdx
   */
  hexists = (...args: CommandArgs<typeof HExistsCommand>) =>
    this.chain(new HExistsCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpire.mdx
   */
  hexpire = (...args: CommandArgs<typeof HExpireCommand>) =>
    this.chain(new HExpireCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpireat.mdx
   */
  hexpireat = (...args: CommandArgs<typeof HExpireAtCommand>) =>
    this.chain(new HExpireAtCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpiretime.mdx
   */
  hexpiretime = (...args: CommandArgs<typeof HExpireTimeCommand>) =>
    this.chain(new HExpireTimeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/httl
   * @see node_modules/@upstash/redis/docs/commands/hash/httl.mdx
   */
  httl = (...args: CommandArgs<typeof HTtlCommand>) =>
    this.chain(new HTtlCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hpexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpire.mdx
   */
  hpexpire = (...args: CommandArgs<typeof HPExpireCommand>) =>
    this.chain(new HPExpireCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hpexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpireat.mdx
   */
  hpexpireat = (...args: CommandArgs<typeof HPExpireAtCommand>) =>
    this.chain(new HPExpireAtCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hpexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpiretime.mdx
   */
  hpexpiretime = (...args: CommandArgs<typeof HPExpireTimeCommand>) =>
    this.chain(new HPExpireTimeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hpttl
   * @see node_modules/@upstash/redis/docs/commands/hash/hpttl.mdx
   */
  hpttl = (...args: CommandArgs<typeof HPTtlCommand>) =>
    this.chain(new HPTtlCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hpersist
   * @see node_modules/@upstash/redis/docs/commands/hash/hpersist.mdx
   */
  hpersist = (...args: CommandArgs<typeof HPersistCommand>) =>
    this.chain(new HPersistCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hget
   * @see node_modules/@upstash/redis/docs/commands/hash/hget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  hget = <TData>(...args: CommandArgs<typeof HGetCommand>) =>
    this.chain(new HGetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hgetall
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetall.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   * With automaticDeserialization: false, hgetall returns a flat array instead, such as
   * ["text", "123", "version", "1"], and [] for a missing key.
   */
  hgetall = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetAllCommand>) =>
    this.chain(new HGetAllCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hgetdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetdel.mdx
   */
  hgetdel = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetDelCommand>) =>
    this.chain(new HGetDelCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hgetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetex.mdx
   */
  hgetex = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetExCommand>) =>
    this.chain(new HGetExCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hincrby
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrby.mdx
   */
  hincrby = (...args: CommandArgs<typeof HIncrByCommand>) =>
    this.chain(new HIncrByCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hincrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrbyfloat.mdx
   */
  hincrbyfloat = (...args: CommandArgs<typeof HIncrByFloatCommand>) =>
    this.chain(new HIncrByFloatCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hkeys
   * @see node_modules/@upstash/redis/docs/commands/hash/hkeys.mdx
   */
  hkeys = (...args: CommandArgs<typeof HKeysCommand>) =>
    this.chain(new HKeysCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hlen.mdx
   */
  hlen = (...args: CommandArgs<typeof HLenCommand>) =>
    this.chain(new HLenCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hmget
   * @see node_modules/@upstash/redis/docs/commands/hash/hmget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  hmget = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HMGetCommand>) =>
    this.chain(new HMGetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = <TData>(key: string, kv: Record<string, TData>) =>
    this.chain(new HMSetCommand([key, kv], this.commandOptions));

  /**
   * @see https://redis.io/commands/hrandfield
   * @see node_modules/@upstash/redis/docs/commands/hash/hrandfield.mdx
   */
  hrandfield = <TData extends string | string[] | Record<string, unknown>>(
    key: string,
    count?: number,
    withValues?: boolean
  ) =>
    this.chain(new HRandFieldCommand<TData>([key, count, withValues] as any, this.commandOptions));

  /**
   * @see https://redis.io/commands/hscan
   * @see node_modules/@upstash/redis/docs/commands/hash/hscan.mdx
   */
  hscan = (...args: CommandArgs<typeof HScanCommand>) =>
    this.chain(new HScanCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hset
   * @see node_modules/@upstash/redis/docs/commands/hash/hset.mdx
   */
  hset = <TData>(key: string, kv: Record<string, TData>) =>
    this.chain(new HSetCommand<TData>([key, kv], this.commandOptions));

  /**
   * @see https://redis.io/commands/hsetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetex.mdx
   */
  hsetex = <TData>(...args: CommandArgs<typeof HSetExCommand<TData>>) =>
    this.chain(new HSetExCommand<TData>(args as any, this.commandOptions));

  /**
   * @see https://redis.io/commands/hsetnx
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetnx.mdx
   */
  hsetnx = <TData>(key: string, field: string, value: TData) =>
    this.chain(new HSetNXCommand<TData>([key, field, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/hstrlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hstrlen.mdx
   */
  hstrlen = (...args: CommandArgs<typeof HStrLenCommand>) =>
    this.chain(new HStrLenCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/hvals
   * @see node_modules/@upstash/redis/docs/commands/hash/hvals.mdx
   */
  hvals = (...args: CommandArgs<typeof HValsCommand>) =>
    this.chain(new HValsCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/incr
   * @see node_modules/@upstash/redis/docs/commands/string/incr.mdx
   */
  incr = (...args: CommandArgs<typeof IncrCommand>) =>
    this.chain(new IncrCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/incrby
   * @see node_modules/@upstash/redis/docs/commands/string/incrby.mdx
   */
  incrby = (...args: CommandArgs<typeof IncrByCommand>) =>
    this.chain(new IncrByCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/incrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/string/incrbyfloat.mdx
   */
  incrbyfloat = (...args: CommandArgs<typeof IncrByFloatCommand>) =>
    this.chain(new IncrByFloatCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/keys
   * @see node_modules/@upstash/redis/docs/commands/generic/keys.mdx
   */
  keys = (...args: CommandArgs<typeof KeysCommand>) =>
    this.chain(new KeysCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lindex
   * @see node_modules/@upstash/redis/docs/commands/list/lindex.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lindex = (...args: CommandArgs<typeof LIndexCommand>) =>
    this.chain(new LIndexCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/linsert
   * @see node_modules/@upstash/redis/docs/commands/list/linsert.mdx
   */
  linsert = <TData>(key: string, direction: "before" | "after", pivot: TData, value: TData) =>
    this.chain(new LInsertCommand<TData>([key, direction, pivot, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/llen
   * @see node_modules/@upstash/redis/docs/commands/list/llen.mdx
   */
  llen = (...args: CommandArgs<typeof LLenCommand>) =>
    this.chain(new LLenCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lmove
   * @see node_modules/@upstash/redis/docs/commands/list/lmove.mdx
   */
  lmove = <TData = string>(...args: CommandArgs<typeof LMoveCommand>) =>
    this.chain(new LMoveCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lpop
   * @see node_modules/@upstash/redis/docs/commands/list/lpop.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lpop = <TData>(...args: CommandArgs<typeof LPopCommand>) =>
    this.chain(new LPopCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = <TData>(...args: CommandArgs<typeof LmPopCommand>) =>
    this.chain(new LmPopCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lpos
   * @see node_modules/@upstash/redis/docs/commands/list/lpos.mdx
   */
  lpos = <TData>(...args: CommandArgs<typeof LPosCommand>) =>
    this.chain(new LPosCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lpush
   * @see node_modules/@upstash/redis/docs/commands/list/lpush.mdx
   */
  lpush = <TData>(key: string, ...elements: TData[]) =>
    this.chain(new LPushCommand<TData>([key, ...elements], this.commandOptions));

  /**
   * @see https://redis.io/commands/lpushx
   * @see node_modules/@upstash/redis/docs/commands/list/lpushx.mdx
   */
  lpushx = <TData>(key: string, ...elements: TData[]) =>
    this.chain(new LPushXCommand<TData>([key, ...elements], this.commandOptions));

  /**
   * @see https://redis.io/commands/lrange
   * @see node_modules/@upstash/redis/docs/commands/list/lrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lrange = <TResult = string>(...args: CommandArgs<typeof LRangeCommand>) =>
    this.chain(new LRangeCommand<TResult>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/lrem
   * @see node_modules/@upstash/redis/docs/commands/list/lrem.mdx
   */
  lrem = <TData>(key: string, count: number, value: TData) =>
    this.chain(new LRemCommand([key, count, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/lset
   * @see node_modules/@upstash/redis/docs/commands/list/lset.mdx
   */
  lset = <TData>(key: string, index: number, value: TData) =>
    this.chain(new LSetCommand([key, index, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/ltrim
   * @see node_modules/@upstash/redis/docs/commands/list/ltrim.mdx
   */
  ltrim = (...args: CommandArgs<typeof LTrimCommand>) =>
    this.chain(new LTrimCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/mget
   * @see node_modules/@upstash/redis/docs/commands/string/mget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  mget = <TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) =>
    this.chain(new MGetCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/mset
   * @see node_modules/@upstash/redis/docs/commands/string/mset.mdx
   */
  mset = <TData>(kv: Record<string, TData>) =>
    this.chain(new MSetCommand<TData>([kv], this.commandOptions));

  /**
   * @see https://redis.io/commands/msetnx
   * @see node_modules/@upstash/redis/docs/commands/string/msetnx.mdx
   */
  msetnx = <TData>(kv: Record<string, TData>) =>
    this.chain(new MSetNXCommand<TData>([kv], this.commandOptions));

  /**
   * @see https://redis.io/commands/persist
   * @see node_modules/@upstash/redis/docs/commands/generic/persist.mdx
   */
  persist = (...args: CommandArgs<typeof PersistCommand>) =>
    this.chain(new PersistCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/pexpire
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpire.mdx
   */
  pexpire = (...args: CommandArgs<typeof PExpireCommand>) =>
    this.chain(new PExpireCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/pexpireat
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpireat.mdx
   */
  pexpireat = (...args: CommandArgs<typeof PExpireAtCommand>) =>
    this.chain(new PExpireAtCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = (...args: CommandArgs<typeof PfAddCommand>) =>
    this.chain(new PfAddCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = (...args: CommandArgs<typeof PfCountCommand>) =>
    this.chain(new PfCountCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = (...args: CommandArgs<typeof PfMergeCommand>) =>
    this.chain(new PfMergeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/ping
   * @see node_modules/@upstash/redis/docs/commands/auth/ping.mdx
   */
  ping = (args?: CommandArgs<typeof PingCommand>) =>
    this.chain(new PingCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = <TData>(key: string, ttl: number, value: TData) =>
    this.chain(new PSetEXCommand<TData>([key, ttl, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/pttl
   * @see node_modules/@upstash/redis/docs/commands/generic/pttl.mdx
   */
  pttl = (...args: CommandArgs<typeof PTtlCommand>) =>
    this.chain(new PTtlCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/publish
   * @see node_modules/@upstash/redis/docs/commands/pubsub/publish.mdx
   */
  publish = (...args: CommandArgs<typeof PublishCommand>) =>
    this.chain(new PublishCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/randomkey
   * @see node_modules/@upstash/redis/docs/commands/generic/randomkey.mdx
   */
  randomkey = () => this.chain(new RandomKeyCommand(this.commandOptions));

  /**
   * @see https://redis.io/commands/rename
   * @see node_modules/@upstash/redis/docs/commands/generic/rename.mdx
   */
  rename = (...args: CommandArgs<typeof RenameCommand>) =>
    this.chain(new RenameCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/renamenx
   * @see node_modules/@upstash/redis/docs/commands/generic/renamenx.mdx
   */
  renamenx = (...args: CommandArgs<typeof RenameNXCommand>) =>
    this.chain(new RenameNXCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/rpop
   * @see node_modules/@upstash/redis/docs/commands/list/rpop.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  rpop = <TData = string>(...args: CommandArgs<typeof RPopCommand>) =>
    this.chain(new RPopCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/rpush
   * @see node_modules/@upstash/redis/docs/commands/list/rpush.mdx
   */
  rpush = <TData>(key: string, ...elements: TData[]) =>
    this.chain(new RPushCommand([key, ...elements], this.commandOptions));

  /**
   * @see https://redis.io/commands/rpushx
   * @see node_modules/@upstash/redis/docs/commands/list/rpushx.mdx
   */
  rpushx = <TData>(key: string, ...elements: TData[]) =>
    this.chain(new RPushXCommand([key, ...elements], this.commandOptions));

  /**
   * @see https://redis.io/commands/sadd
   * @see node_modules/@upstash/redis/docs/commands/set/sadd.mdx
   */
  sadd = <TData>(key: string, member: TData, ...members: TData[]) =>
    this.chain(new SAddCommand<TData>([key, member, ...members], this.commandOptions));

  /**
   * @see https://redis.io/commands/scan
   * @see node_modules/@upstash/redis/docs/commands/generic/scan.mdx
   */
  scan = (...args: CommandArgs<typeof ScanCommand>) =>
    this.chain(new ScanCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/scard
   * @see node_modules/@upstash/redis/docs/commands/set/scard.mdx
   */
  scard = (...args: CommandArgs<typeof SCardCommand>) =>
    this.chain(new SCardCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/script-exists
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_exists.mdx
   */
  scriptExists = (...args: CommandArgs<typeof ScriptExistsCommand>) =>
    this.chain(new ScriptExistsCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/script-flush
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_flush.mdx
   */
  scriptFlush = (...args: CommandArgs<typeof ScriptFlushCommand>) =>
    this.chain(new ScriptFlushCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/script-load
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_load.mdx
   */
  scriptLoad = (...args: CommandArgs<typeof ScriptLoadCommand>) =>
    this.chain(new ScriptLoadCommand(args, this.commandOptions));
  /*)*
   * @see https://redis.io/commands/sdiff
   * @see node_modules/@upstash/redis/docs/commands/set/sdiff.mdx
   */
  sdiff = (...args: CommandArgs<typeof SDiffCommand>) =>
    this.chain(new SDiffCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sdiffstore
   * @see node_modules/@upstash/redis/docs/commands/set/sdiffstore.mdx
   */
  sdiffstore = (...args: CommandArgs<typeof SDiffStoreCommand>) =>
    this.chain(new SDiffStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/set
   * @see node_modules/@upstash/redis/docs/commands/string/set.mdx
   */
  set = <TData>(key: string, value: TData, opts?: SetCommandOptions) =>
    this.chain(new SetCommand<TData>([key, value, opts], this.commandOptions));

  /**
   * @see https://redis.io/commands/setbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/setbit.mdx
   */
  setbit = (...args: CommandArgs<typeof SetBitCommand>) =>
    this.chain(new SetBitCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/setex
   */
  setex = <TData>(key: string, ttl: number, value: TData) =>
    this.chain(new SetExCommand<TData>([key, ttl, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = <TData>(key: string, value: TData) =>
    this.chain(new SetNxCommand<TData>([key, value], this.commandOptions));

  /**
   * @see https://redis.io/commands/setrange
   * @see node_modules/@upstash/redis/docs/commands/string/setrange.mdx
   */
  setrange = (...args: CommandArgs<typeof SetRangeCommand>) =>
    this.chain(new SetRangeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sinter
   * @see node_modules/@upstash/redis/docs/commands/set/sinter.mdx
   */
  sinter = (...args: CommandArgs<typeof SInterCommand>) =>
    this.chain(new SInterCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = (...args: CommandArgs<typeof SInterCardCommand>) =>
    this.chain(new SInterCardCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sinterstore
   * @see node_modules/@upstash/redis/docs/commands/set/sinterstore.mdx
   */
  sinterstore = (...args: CommandArgs<typeof SInterStoreCommand>) =>
    this.chain(new SInterStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sismember
   * @see node_modules/@upstash/redis/docs/commands/set/sismember.mdx
   */
  sismember = <TData>(key: string, member: TData) =>
    this.chain(new SIsMemberCommand<TData>([key, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/smembers
   * @see node_modules/@upstash/redis/docs/commands/set/smembers.mdx
   */
  smembers = <TData extends unknown[] = string[]>(...args: CommandArgs<typeof SMembersCommand>) =>
    this.chain(new SMembersCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/smismember
   * @see node_modules/@upstash/redis/docs/commands/set/smismember.mdx
   */
  smismember = <TMembers extends unknown[]>(key: string, members: TMembers) =>
    this.chain(new SMIsMemberCommand<TMembers>([key, members], this.commandOptions));

  /**
   * @see https://redis.io/commands/smove
   * @see node_modules/@upstash/redis/docs/commands/set/smove.mdx
   */
  smove = <TData>(source: string, destination: string, member: TData) =>
    this.chain(new SMoveCommand<TData>([source, destination, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/spop
   * @see node_modules/@upstash/redis/docs/commands/set/spop.mdx
   */
  spop = <TData>(...args: CommandArgs<typeof SPopCommand>) =>
    this.chain(new SPopCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/srandmember
   * @see node_modules/@upstash/redis/docs/commands/set/srandmember.mdx
   */
  srandmember = <TData>(...args: CommandArgs<typeof SRandMemberCommand>) =>
    this.chain(new SRandMemberCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/srem
   * @see node_modules/@upstash/redis/docs/commands/set/srem.mdx
   */
  srem = <TData>(key: string, ...members: TData[]) =>
    this.chain(new SRemCommand<TData>([key, ...members], this.commandOptions));

  /**
   * @see https://redis.io/commands/sscan
   * @see node_modules/@upstash/redis/docs/commands/set/sscan.mdx
   */
  sscan = (...args: CommandArgs<typeof SScanCommand>) =>
    this.chain(new SScanCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/strlen
   * @see node_modules/@upstash/redis/docs/commands/string/strlen.mdx
   */
  strlen = (...args: CommandArgs<typeof StrLenCommand>) =>
    this.chain(new StrLenCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sunion
   * @see node_modules/@upstash/redis/docs/commands/set/sunion.mdx
   */
  sunion = (...args: CommandArgs<typeof SUnionCommand>) =>
    this.chain(new SUnionCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/sunionstore
   * @see node_modules/@upstash/redis/docs/commands/set/sunionstore.mdx
   */
  sunionstore = (...args: CommandArgs<typeof SUnionStoreCommand>) =>
    this.chain(new SUnionStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/time
   */
  time = () => this.chain(new TimeCommand(this.commandOptions));

  /**
   * @see https://redis.io/commands/touch
   * @see node_modules/@upstash/redis/docs/commands/generic/touch.mdx
   */
  touch = (...args: CommandArgs<typeof TouchCommand>) =>
    this.chain(new TouchCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/ttl
   * @see node_modules/@upstash/redis/docs/commands/generic/ttl.mdx
   */
  ttl = (...args: CommandArgs<typeof TtlCommand>) =>
    this.chain(new TtlCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/type
   * @see node_modules/@upstash/redis/docs/commands/generic/type.mdx
   */
  type = (...args: CommandArgs<typeof TypeCommand>) =>
    this.chain(new TypeCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/unlink
   * @see node_modules/@upstash/redis/docs/commands/generic/unlink.mdx
   */
  unlink = (...args: CommandArgs<typeof UnlinkCommand>) =>
    this.chain(new UnlinkCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zadd
   * @see node_modules/@upstash/redis/docs/commands/zset/zadd.mdx
   */
  zadd = <TData>(
    ...args:
      | [key: string, scoreMember: ScoreMember<TData>, ...scoreMemberPairs: ScoreMember<TData>[]]
      | [
          key: string,
          opts: ZAddCommandOptions,
          ...scoreMemberPairs: [ScoreMember<TData>, ...ScoreMember<TData>[]],
        ]
  ) => {
    if ("score" in args[1]) {
      return this.chain(
        new ZAddCommand<TData>([args[0], args[1], ...(args.slice(2) as any)], this.commandOptions)
      );
    }

    return this.chain(
      new ZAddCommand<TData>(
        [args[0], args[1] as any, ...(args.slice(2) as any)],
        this.commandOptions
      )
    );
  };

  /**
   * @see https://redis.io/commands/xadd
   * @see node_modules/@upstash/redis/docs/commands/stream/xadd.mdx
   */
  xadd = (...args: CommandArgs<typeof XAddCommand>) =>
    this.chain(new XAddCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xack
   * @see node_modules/@upstash/redis/docs/commands/stream/xack.mdx
   */
  xack = (...args: CommandArgs<typeof XAckCommand>) =>
    this.chain(new XAckCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xackdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xackdel.mdx
   */
  xackdel = (...args: CommandArgs<typeof XAckDelCommand>) =>
    this.chain(new XAckDelCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xdel.mdx
   */
  xdel = (...args: CommandArgs<typeof XDelCommand>) =>
    this.chain(new XDelCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xdelex
   * @see node_modules/@upstash/redis/docs/commands/stream/xdelex.mdx
   */
  xdelex = (...args: CommandArgs<typeof XDelExCommand>) =>
    this.chain(new XDelExCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xgroup.mdx
   */
  xgroup = (...args: CommandArgs<typeof XGroupCommand>) =>
    this.chain(new XGroupCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xread
   * @see node_modules/@upstash/redis/docs/commands/stream/xread.mdx
   */
  xread = (...args: CommandArgs<typeof XReadCommand>) =>
    this.chain(new XReadCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xreadgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xreadgroup.mdx
   */
  xreadgroup = (...args: CommandArgs<typeof XReadGroupCommand>) =>
    this.chain(new XReadGroupCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xinfo
   * @see node_modules/@upstash/redis/docs/commands/stream/xinfo.mdx
   */
  xinfo = (...args: CommandArgs<typeof XInfoCommand>) =>
    this.chain(new XInfoCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xlen
   * @see node_modules/@upstash/redis/docs/commands/stream/xlen.mdx
   */
  xlen = (...args: CommandArgs<typeof XLenCommand>) =>
    this.chain(new XLenCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xpending
   * @see node_modules/@upstash/redis/docs/commands/stream/xpending.mdx
   */
  xpending = (...args: CommandArgs<typeof XPendingCommand>) =>
    this.chain(new XPendingCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xclaim.mdx
   */
  xclaim = (...args: CommandArgs<typeof XClaimCommand>) =>
    this.chain(new XClaimCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xautoclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xautoclaim.mdx
   */
  xautoclaim = (...args: CommandArgs<typeof XAutoClaim>) =>
    this.chain(new XAutoClaim(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xtrim
   * @see node_modules/@upstash/redis/docs/commands/stream/xtrim.mdx
   */
  xtrim = (...args: CommandArgs<typeof XTrimCommand>) =>
    this.chain(new XTrimCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  xrange = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof XRangeCommand>) =>
    this.chain(new XRangeCommand<Record<string, TData>>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/xrevrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrevrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  xrevrange = <TData extends Record<string, unknown>>(
    ...args: CommandArgs<typeof XRevRangeCommand>
  ) => this.chain(new XRevRangeCommand<Record<string, TData>>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zcard
   * @see node_modules/@upstash/redis/docs/commands/zset/zcard.mdx
   */
  zcard = (...args: CommandArgs<typeof ZCardCommand>) =>
    this.chain(new ZCardCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zcount.mdx
   */
  zcount = (...args: CommandArgs<typeof ZCountCommand>) =>
    this.chain(new ZCountCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zincrby
   * @see node_modules/@upstash/redis/docs/commands/zset/zincrby.mdx
   */
  zincrby = <TData>(key: string, increment: number, member: TData) =>
    this.chain(new ZIncrByCommand<TData>([key, increment, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/zinterstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zinterstore.mdx
   */
  zinterstore = (...args: CommandArgs<typeof ZInterStoreCommand>) =>
    this.chain(new ZInterStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zlexcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zlexcount.mdx
   */
  zlexcount = (...args: CommandArgs<typeof ZLexCountCommand>) =>
    this.chain(new ZLexCountCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zmscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zmscore.mdx
   */
  zmscore = (...args: CommandArgs<typeof ZMScoreCommand>) =>
    this.chain(new ZMScoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zpopmax
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmax.mdx
   */
  zpopmax = <TData>(...args: CommandArgs<typeof ZPopMaxCommand>) =>
    this.chain(new ZPopMaxCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zpopmin
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmin.mdx
   */
  zpopmin = <TData>(...args: CommandArgs<typeof ZPopMinCommand>) =>
    this.chain(new ZPopMinCommand<TData>(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zrange
   * @see node_modules/@upstash/redis/docs/commands/zset/zrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
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
  ) => this.chain(new ZRangeCommand<TData>(args as any, this.commandOptions));

  /**
   * @see https://redis.io/commands/zrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrank.mdx
   */
  zrank = <TData>(key: string, member: TData) =>
    this.chain(new ZRankCommand<TData>([key, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/zrem
   * @see node_modules/@upstash/redis/docs/commands/zset/zrem.mdx
   */
  zrem = <TData>(key: string, ...members: TData[]) =>
    this.chain(new ZRemCommand<TData>([key, ...members], this.commandOptions));

  /**
   * @see https://redis.io/commands/zremrangebylex
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebylex.mdx
   */
  zremrangebylex = (...args: CommandArgs<typeof ZRemRangeByLexCommand>) =>
    this.chain(new ZRemRangeByLexCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zremrangebyrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyrank.mdx
   */
  zremrangebyrank = (...args: CommandArgs<typeof ZRemRangeByRankCommand>) =>
    this.chain(new ZRemRangeByRankCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zremrangebyscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyscore.mdx
   */
  zremrangebyscore = (...args: CommandArgs<typeof ZRemRangeByScoreCommand>) =>
    this.chain(new ZRemRangeByScoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zrevrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrevrank.mdx
   */
  zrevrank = <TData>(key: string, member: TData) =>
    this.chain(new ZRevRankCommand<TData>([key, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/zscan
   * @see node_modules/@upstash/redis/docs/commands/zset/zscan.mdx
   */
  zscan = (...args: CommandArgs<typeof ZScanCommand>) =>
    this.chain(new ZScanCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zscore.mdx
   */
  zscore = <TData>(key: string, member: TData) =>
    this.chain(new ZScoreCommand<TData>([key, member], this.commandOptions));

  /**
   * @see https://redis.io/commands/zunionstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zunionstore.mdx
   */
  zunionstore = (...args: CommandArgs<typeof ZUnionStoreCommand>) =>
    this.chain(new ZUnionStoreCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = (...args: CommandArgs<typeof ZUnionCommand>) =>
    this.chain(new ZUnionCommand(args, this.commandOptions));

  /**
   * @see https://redis.io/commands/?group=json
   */
  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       * @see node_modules/@upstash/redis/docs/commands/json/arrappend.mdx
       */
      arrappend: (...args: CommandArgs<typeof JsonArrAppendCommand>) =>
        this.chain(new JsonArrAppendCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.arrindex
       * @see node_modules/@upstash/redis/docs/commands/json/arrindex.mdx
       */
      arrindex: (...args: CommandArgs<typeof JsonArrIndexCommand>) =>
        this.chain(new JsonArrIndexCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.arrinsert
       * @see node_modules/@upstash/redis/docs/commands/json/arrinsert.mdx
       */
      arrinsert: (...args: CommandArgs<typeof JsonArrInsertCommand>) =>
        this.chain(new JsonArrInsertCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.arrlen
       * @see node_modules/@upstash/redis/docs/commands/json/arrlen.mdx
       */
      arrlen: (...args: CommandArgs<typeof JsonArrLenCommand>) =>
        this.chain(new JsonArrLenCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.arrpop
       * @see node_modules/@upstash/redis/docs/commands/json/arrpop.mdx
       */
      arrpop: (...args: CommandArgs<typeof JsonArrPopCommand>) =>
        this.chain(new JsonArrPopCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.arrtrim
       * @see node_modules/@upstash/redis/docs/commands/json/arrtrim.mdx
       */
      arrtrim: (...args: CommandArgs<typeof JsonArrTrimCommand>) =>
        this.chain(new JsonArrTrimCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.clear
       * @see node_modules/@upstash/redis/docs/commands/json/clear.mdx
       */
      clear: (...args: CommandArgs<typeof JsonClearCommand>) =>
        this.chain(new JsonClearCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.del
       * @see node_modules/@upstash/redis/docs/commands/json/del.mdx
       */
      del: (...args: CommandArgs<typeof JsonDelCommand>) =>
        this.chain(new JsonDelCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.forget
       * @see node_modules/@upstash/redis/docs/commands/json/forget.mdx
       */
      forget: (...args: CommandArgs<typeof JsonForgetCommand>) =>
        this.chain(new JsonForgetCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.get
       * @see node_modules/@upstash/redis/docs/commands/json/get.mdx
       */
      get: (...args: CommandArgs<typeof JsonGetCommand>) =>
        this.chain(new JsonGetCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.merge
       * @see node_modules/@upstash/redis/docs/commands/json/merge.mdx
       */
      merge: (...args: CommandArgs<typeof JsonMergeCommand>) =>
        this.chain(new JsonMergeCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.mget
       * @see node_modules/@upstash/redis/docs/commands/json/mget.mdx
       */
      mget: (...args: CommandArgs<typeof JsonMGetCommand>) =>
        this.chain(new JsonMGetCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.mset
       * @see node_modules/@upstash/redis/docs/commands/json/mset.mdx
       */
      mset: (...args: CommandArgs<typeof JsonMSetCommand>) =>
        this.chain(new JsonMSetCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.numincrby
       * @see node_modules/@upstash/redis/docs/commands/json/numincrby.mdx
       */
      numincrby: (...args: CommandArgs<typeof JsonNumIncrByCommand>) =>
        this.chain(new JsonNumIncrByCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.nummultby
       * @see node_modules/@upstash/redis/docs/commands/json/nummultby.mdx
       */
      nummultby: (...args: CommandArgs<typeof JsonNumMultByCommand>) =>
        this.chain(new JsonNumMultByCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.objkeys
       * @see node_modules/@upstash/redis/docs/commands/json/objkeys.mdx
       */
      objkeys: (...args: CommandArgs<typeof JsonObjKeysCommand>) =>
        this.chain(new JsonObjKeysCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.objlen
       * @see node_modules/@upstash/redis/docs/commands/json/objlen.mdx
       */
      objlen: (...args: CommandArgs<typeof JsonObjLenCommand>) =>
        this.chain(new JsonObjLenCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: (...args: CommandArgs<typeof JsonRespCommand>) =>
        this.chain(new JsonRespCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.set
       * @see node_modules/@upstash/redis/docs/commands/json/set.mdx
       */
      set: (...args: CommandArgs<typeof JsonSetCommand>) =>
        this.chain(new JsonSetCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.strappend
       * @see node_modules/@upstash/redis/docs/commands/json/strappend.mdx
       */
      strappend: (...args: CommandArgs<typeof JsonStrAppendCommand>) =>
        this.chain(new JsonStrAppendCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.strlen
       * @see node_modules/@upstash/redis/docs/commands/json/strlen.mdx
       */
      strlen: (...args: CommandArgs<typeof JsonStrLenCommand>) =>
        this.chain(new JsonStrLenCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.toggle
       * @see node_modules/@upstash/redis/docs/commands/json/toggle.mdx
       */
      toggle: (...args: CommandArgs<typeof JsonToggleCommand>) =>
        this.chain(new JsonToggleCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/commands/json.type
       * @see node_modules/@upstash/redis/docs/commands/json/type.mdx
       */
      type: (...args: CommandArgs<typeof JsonTypeCommand>) =>
        this.chain(new JsonTypeCommand(args, this.commandOptions)),
    };
  }

  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       * @see node_modules/@upstash/redis/docs/commands/functions/load.mdx
       */
      load: (...args: CommandArgs<typeof FunctionLoadCommand>) =>
        this.chain(new FunctionLoadCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       * @see node_modules/@upstash/redis/docs/commands/functions/list.mdx
       */
      list: (...args: CommandArgs<typeof FunctionListCommand>) =>
        this.chain(new FunctionListCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       * @see node_modules/@upstash/redis/docs/commands/functions/delete.mdx
       */
      delete: (...args: CommandArgs<typeof FunctionDeleteCommand>) =>
        this.chain(new FunctionDeleteCommand(args, this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       * @see node_modules/@upstash/redis/docs/commands/functions/flush.mdx
       */
      flush: () => this.chain(new FunctionFlushCommand(this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       * @see node_modules/@upstash/redis/docs/commands/functions/stats.mdx
       */
      stats: () => this.chain(new FunctionStatsCommand(this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       * @see node_modules/@upstash/redis/docs/commands/functions/call.mdx
       */
      call: <TData = unknown>(...args: CommandArgs<typeof FCallCommand<TData>>) =>
        this.chain(new FCallCommand<TData>(args, this.commandOptions)),

      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       * @see node_modules/@upstash/redis/docs/commands/functions/call_ro.mdx
       */
      callRo: <TData = unknown>(...args: CommandArgs<typeof FCallRoCommand<TData>>) =>
        this.chain(new FCallRoCommand<TData>(args, this.commandOptions)),
    };
  }
}
