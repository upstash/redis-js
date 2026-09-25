import { createAutoPipelineProxy } from "../pkg/auto-pipeline";
import type {
  CommandOptions,
  ScoreMember,
  SetCommandOptions,
  ZAddCommandOptions,
  ZRangeCommandOptions,
  ScanCommandOptions,
  ScanResultStandard,
  ScanResultWithType,
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
  ExecCommand,
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
  HRandFieldCommand,
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
import {
  type CreateIndexParameters,
  type NestedIndexSchema,
  type FlatIndexSchema,
} from "./commands/search";
import type { InitIndexParameters } from "./commands/search/search";
import { createIndex, initIndex, listAliases, addAlias, delAlias } from "./commands/search/search";
import type { CreateVectorIndexParameters } from "./commands/vector/vector";
import { createVectorIndex, initVectorIndex } from "./commands/vector/vector";
import { Subscriber } from "./commands/subscribe";
import { ZDiffStoreCommand } from "./commands/zdiffstore";
import { ZMScoreCommand } from "./commands/zmscore";
import type { Requester, UpstashRequest, UpstashResponse } from "./http";
import { Pipeline } from "./pipeline";
import { Script } from "./script";
import { ScriptRO } from "./scriptRo";
import type { CommandArgs, RedisOptions, Telemetry } from "./types";

// See https://github.com/upstash/upstash-redis/issues/342
// why we need this export
export type { RedisOptions } from "./types";

/**
 * Serverless redis client for upstash.
 */
export class Redis {
  protected client: Requester;
  protected opts?: CommandOptions<any, any>;
  protected enableTelemetry: boolean;
  protected enableAutoPipelining: boolean;

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
  constructor(client: Requester, opts?: RedisOptions) {
    this.client = client;
    this.opts = opts;
    this.enableTelemetry = opts?.enableTelemetry ?? true;

    if (opts?.readYourWrites === false) {
      this.client.readYourWrites = false;
    }
    this.enableAutoPipelining = opts?.enableAutoPipelining ?? true;
  }

  get readYourWritesSyncToken(): string | undefined {
    return this.client.upstashSyncToken;
  }

  set readYourWritesSyncToken(session: string | undefined) {
    this.client.upstashSyncToken = session;
  }

  get json() {
    return {
      /**
       * @see https://redis.io/commands/json.arrappend
       * @see node_modules/@upstash/redis/docs/commands/json/arrappend.mdx
       */
      arrappend: (...args: CommandArgs<typeof JsonArrAppendCommand>) =>
        new JsonArrAppendCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.arrindex
       * @see node_modules/@upstash/redis/docs/commands/json/arrindex.mdx
       */
      arrindex: (...args: CommandArgs<typeof JsonArrIndexCommand>) =>
        new JsonArrIndexCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.arrinsert
       * @see node_modules/@upstash/redis/docs/commands/json/arrinsert.mdx
       */
      arrinsert: (...args: CommandArgs<typeof JsonArrInsertCommand>) =>
        new JsonArrInsertCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.arrlen
       * @see node_modules/@upstash/redis/docs/commands/json/arrlen.mdx
       */
      arrlen: (...args: CommandArgs<typeof JsonArrLenCommand>) =>
        new JsonArrLenCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.arrpop
       * @see node_modules/@upstash/redis/docs/commands/json/arrpop.mdx
       */
      arrpop: (...args: CommandArgs<typeof JsonArrPopCommand>) =>
        new JsonArrPopCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.arrtrim
       * @see node_modules/@upstash/redis/docs/commands/json/arrtrim.mdx
       */
      arrtrim: (...args: CommandArgs<typeof JsonArrTrimCommand>) =>
        new JsonArrTrimCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.clear
       * @see node_modules/@upstash/redis/docs/commands/json/clear.mdx
       */
      clear: (...args: CommandArgs<typeof JsonClearCommand>) =>
        new JsonClearCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.del
       * @see node_modules/@upstash/redis/docs/commands/json/del.mdx
       */
      del: (...args: CommandArgs<typeof JsonDelCommand>) =>
        new JsonDelCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.forget
       * @see node_modules/@upstash/redis/docs/commands/json/forget.mdx
       */
      forget: (...args: CommandArgs<typeof JsonForgetCommand>) =>
        new JsonForgetCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.get
       * @see node_modules/@upstash/redis/docs/commands/json/get.mdx
       */
      get: <TData>(...args: CommandArgs<typeof JsonGetCommand>) =>
        new JsonGetCommand<TData>(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.merge
       * @see node_modules/@upstash/redis/docs/commands/json/merge.mdx
       */
      merge: (...args: CommandArgs<typeof JsonMergeCommand>) =>
        new JsonMergeCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.mget
       * @see node_modules/@upstash/redis/docs/commands/json/mget.mdx
       */
      mget: <TData>(...args: CommandArgs<typeof JsonMGetCommand>) =>
        new JsonMGetCommand<TData>(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.mset
       * @see node_modules/@upstash/redis/docs/commands/json/mset.mdx
       */
      mset: (...args: CommandArgs<typeof JsonMSetCommand>) =>
        new JsonMSetCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.numincrby
       * @see node_modules/@upstash/redis/docs/commands/json/numincrby.mdx
       */
      numincrby: (...args: CommandArgs<typeof JsonNumIncrByCommand>) =>
        new JsonNumIncrByCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.nummultby
       * @see node_modules/@upstash/redis/docs/commands/json/nummultby.mdx
       */
      nummultby: (...args: CommandArgs<typeof JsonNumMultByCommand>) =>
        new JsonNumMultByCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.objkeys
       * @see node_modules/@upstash/redis/docs/commands/json/objkeys.mdx
       */
      objkeys: (...args: CommandArgs<typeof JsonObjKeysCommand>) =>
        new JsonObjKeysCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.objlen
       * @see node_modules/@upstash/redis/docs/commands/json/objlen.mdx
       */
      objlen: (...args: CommandArgs<typeof JsonObjLenCommand>) =>
        new JsonObjLenCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.resp
       */
      resp: (...args: CommandArgs<typeof JsonRespCommand>) =>
        new JsonRespCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.set
       * @see node_modules/@upstash/redis/docs/commands/json/set.mdx
       */
      set: (...args: CommandArgs<typeof JsonSetCommand>) =>
        new JsonSetCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.strappend
       * @see node_modules/@upstash/redis/docs/commands/json/strappend.mdx
       */
      strappend: (...args: CommandArgs<typeof JsonStrAppendCommand>) =>
        new JsonStrAppendCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.strlen
       * @see node_modules/@upstash/redis/docs/commands/json/strlen.mdx
       */
      strlen: (...args: CommandArgs<typeof JsonStrLenCommand>) =>
        new JsonStrLenCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.toggle
       * @see node_modules/@upstash/redis/docs/commands/json/toggle.mdx
       */
      toggle: (...args: CommandArgs<typeof JsonToggleCommand>) =>
        new JsonToggleCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/commands/json.type
       * @see node_modules/@upstash/redis/docs/commands/json/type.mdx
       */
      type: (...args: CommandArgs<typeof JsonTypeCommand>) =>
        new JsonTypeCommand(args, this.opts).exec(this.client),
    };
  }

  get functions() {
    return {
      /**
       * @see https://redis.io/docs/latest/commands/function-load/
       * @see node_modules/@upstash/redis/docs/commands/functions/load.mdx
       */
      load: (...args: CommandArgs<typeof FunctionLoadCommand>) =>
        new FunctionLoadCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/function-list/
       * @see node_modules/@upstash/redis/docs/commands/functions/list.mdx
       */
      list: (...args: CommandArgs<typeof FunctionListCommand>) =>
        new FunctionListCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/function-delete/
       * @see node_modules/@upstash/redis/docs/commands/functions/delete.mdx
       */
      delete: (...args: CommandArgs<typeof FunctionDeleteCommand>) =>
        new FunctionDeleteCommand(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/function-flush/
       * @see node_modules/@upstash/redis/docs/commands/functions/flush.mdx
       */
      flush: () => new FunctionFlushCommand(this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/function-stats/
       * @see node_modules/@upstash/redis/docs/commands/functions/stats.mdx
       *
       * Note: `running_script` field is not supported and therefore not included in the type.
       */
      stats: () => new FunctionStatsCommand(this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/fcall/
       * @see node_modules/@upstash/redis/docs/commands/functions/call.mdx
       */
      call: <TData = unknown>(...args: CommandArgs<typeof FCallCommand<TData>>) =>
        new FCallCommand<TData>(args, this.opts).exec(this.client),

      /**
       * @see https://redis.io/docs/latest/commands/fcall_ro/
       * @see node_modules/@upstash/redis/docs/commands/functions/call_ro.mdx
       */
      callRo: <TData = unknown>(...args: CommandArgs<typeof FCallRoCommand<TData>>) =>
        new FCallRoCommand<TData>(args, this.opts).exec(this.client),
    };
  }
  /**
   * Wrap a new middleware around the HTTP client.
   */
  use = <TResult = unknown>(
    middleware: (
      r: UpstashRequest,
      next: <TResult = unknown>(req: UpstashRequest) => Promise<UpstashResponse<TResult>>
    ) => Promise<UpstashResponse<TResult>>
  ) => {
    const makeRequest = this.client.request.bind(this.client);
    this.client.request = (req: UpstashRequest) => middleware(req, makeRequest) as any;
  };

  /**
   * Technically this is not private, we can hide it from intellisense by doing this
   */
  protected addTelemetry = (telemetry: Telemetry) => {
    if (!this.enableTelemetry) {
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - The `Requester` interface does not know about this method but it will be there
      // as long as the user uses the standard HttpClient
      this.client.mergeTelemetry(telemetry);
    } catch {
      // ignore
    }
  };

  /**
   * Creates a new script.
   *
   * Scripts offer the ability to optimistically try to execute a script without having to send the
   * entire script to the server. If the script is loaded on the server, it tries again by sending
   * the entire script. Afterwards, the script is cached on the server.
   *
   * @param script - The script to create
   * @param opts - Optional options to pass to the script `{ readonly?: boolean }`
   * @returns A new script
   *
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];")
   * const arg1 = await script.eval([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   * @example
   * ```ts
   * const redis = new Redis({...})
   *
   * const script = redis.createScript<string>("return ARGV[1];", { readonly: true })
   * const arg1 = await script.evalRo([], ["Hello World"])
   * expect(arg1, "Hello World")
   * ```
   */

  createScript<TResult = unknown, TReadonly extends boolean = false>(
    script: string,
    opts?: { readonly?: TReadonly }
  ): TReadonly extends true ? ScriptRO<TResult> : Script<TResult> {
    return opts?.readonly ? (new ScriptRO(this, script) as any) : (new Script(this, script) as any);
  }

  get search() {
    return {
      createIndex: <TSchema extends NestedIndexSchema | FlatIndexSchema>(
        params: CreateIndexParameters<TSchema>
      ) => {
        return createIndex<TSchema>(this.client, params);
      },

      index: <TSchema extends NestedIndexSchema | FlatIndexSchema>(
        params: InitIndexParameters<TSchema>
      ) => {
        return initIndex<TSchema>(this.client, params);
      },

      alias: {
        list: () => {
          return listAliases(this.client);
        },

        add: ({ indexName, alias }: { indexName: string; alias: string }) => {
          return addAlias(this.client, { indexName, alias });
        },

        delete: ({ alias }: { alias: string }) => {
          return delAlias(this.client, { alias });
        },
      },
    };
  }

  /**
   * Vector index commands.
   *
   * @example
   * ```typescript
   * const index = await redis.vector.createIndex({ name: "docs", dimension: 3, metric: "COSINE" });
   * await index.add("doc-1", [0.1, 0.2, 0.3]);
   * const hits = await index.query({ vector: [0.1, 0.2, 0.3], topK: 5 });
   * ```
   */
  get vector() {
    return {
      /**
       * Creates a vector index and returns a handle to it.
       */
      createIndex: (params: CreateVectorIndexParameters) => {
        return createVectorIndex(this.client, params, this.opts);
      },

      /**
       * Returns a handle to an existing vector index without sending any command.
       */
      index: (name: string) => {
        return initVectorIndex(this.client, name, this.opts);
      },
    };
  }

  /**
   * Create a new pipeline that allows you to send requests in bulk.
   *
   * @see {@link Pipeline}
   */
  pipeline = () =>
    new Pipeline({
      client: this.client,
      commandOptions: this.opts,
      multiExec: false,
    });

  protected autoPipeline = () => {
    return createAutoPipelineProxy(this);
  };

  /**
   * Create a new transaction to allow executing multiple steps atomically.
   *
   * All the commands in a transaction are serialized and executed sequentially. A request sent by
   * another client will never be served in the middle of the execution of a Redis Transaction. This
   * guarantees that the commands are executed as a single isolated operation.
   *
   * @see {@link Pipeline}
   */
  multi = () =>
    new Pipeline({
      client: this.client,
      commandOptions: this.opts,
      multiExec: true,
    });

  /**
   * Returns an instance that can be used to execute `BITFIELD` commands on one key.
   *
   * @example
   * ```typescript
   * redis.set("mykey", 0);
   * const result = await redis.bitfield("mykey")
   *   .set("u4", 0, 16)
   *   .incr("u4", "#1", 1)
   *   .exec();
   * console.log(result); // [0, 1]
   * ```
   *
   * @see https://redis.io/commands/bitfield
   */
  bitfield = (...args: CommandArgs<typeof BitFieldCommand>) =>
    new BitFieldCommand(args, this.client, this.opts);

  /**
   * @see https://redis.io/commands/append
   * @see node_modules/@upstash/redis/docs/commands/string/append.mdx
   */
  append = (...args: CommandArgs<typeof AppendCommand>) =>
    new AppendCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arcount
   * @see node_modules/@upstash/redis/docs/commands/array/arcount.mdx
   */
  arcount = (...args: CommandArgs<typeof ArCountCommand>) =>
    new ArCountCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/ardel
   * @see node_modules/@upstash/redis/docs/commands/array/ardel.mdx
   */
  ardel = (...args: CommandArgs<typeof ArDelCommand>) =>
    new ArDelCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/ardelrange
   * @see node_modules/@upstash/redis/docs/commands/array/ardelrange.mdx
   */
  ardelrange = (...args: CommandArgs<typeof ArDelRangeCommand>) =>
    new ArDelRangeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arget
   * @see node_modules/@upstash/redis/docs/commands/array/arget.mdx
   */
  arget = <TData = string>(...args: CommandArgs<typeof ArGetCommand>) =>
    new ArGetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/argetrange
   * @see node_modules/@upstash/redis/docs/commands/array/argetrange.mdx
   */
  argetrange = <TData = string>(...args: CommandArgs<typeof ArGetRangeCommand>) =>
    new ArGetRangeCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/argrep
   * @see node_modules/@upstash/redis/docs/commands/array/argrep.mdx
   */
  argrep = <TData = string, TOpts extends ArGrepOptions = ArGrepOptions>(
    key: string,
    start: number | string,
    end: number | string,
    opts: TOpts
  ) => new ArGrepCommand<TData, TOpts>([key, start, end, opts], this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arinfo
   * @see node_modules/@upstash/redis/docs/commands/array/arinfo.mdx
   */
  arinfo = (...args: CommandArgs<typeof ArInfoCommand>) =>
    new ArInfoCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arinsert
   * @see node_modules/@upstash/redis/docs/commands/array/arinsert.mdx
   */
  arinsert = <TData>(key: string, ...values: TData[]) =>
    new ArInsertCommand<TData>([key, ...values], this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arlastitems
   * @see node_modules/@upstash/redis/docs/commands/array/arlastitems.mdx
   */
  arlastitems = <TData = string>(...args: CommandArgs<typeof ArLastItemsCommand>) =>
    new ArLastItemsCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arlen
   * @see node_modules/@upstash/redis/docs/commands/array/arlen.mdx
   */
  arlen = (...args: CommandArgs<typeof ArLenCommand>) =>
    new ArLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/armget
   * @see node_modules/@upstash/redis/docs/commands/array/armget.mdx
   */
  armget = <TData = string>(...args: CommandArgs<typeof ArMGetCommand>) =>
    new ArMGetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/armset
   * @see node_modules/@upstash/redis/docs/commands/array/armset.mdx
   */
  armset = <TData>(key: string, values: ArMSetValues<TData>) =>
    new ArMSetCommand<TData>([key, values], this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arnext
   * @see node_modules/@upstash/redis/docs/commands/array/arnext.mdx
   */
  arnext = (...args: CommandArgs<typeof ArNextCommand>) =>
    new ArNextCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arop
   * @see node_modules/@upstash/redis/docs/commands/array/arop.mdx
   */
  arop = <TData = string>(
    key: string,
    start: number | string,
    end: number | string,
    operation: ArOpOperation<TData>
  ) => new ArOpCommand<TData>([key, start, end, operation], this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arring
   * @see node_modules/@upstash/redis/docs/commands/array/arring.mdx
   */
  arring = <TData>(key: string, size: number, ...values: TData[]) =>
    new ArRingCommand<TData>([key, size, ...values], this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arscan
   * @see node_modules/@upstash/redis/docs/commands/array/arscan.mdx
   */
  arscan = <TData = string>(...args: CommandArgs<typeof ArScanCommand>) =>
    new ArScanCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arseek
   * @see node_modules/@upstash/redis/docs/commands/array/arseek.mdx
   */
  arseek = (...args: CommandArgs<typeof ArSeekCommand>) =>
    new ArSeekCommand(args, this.opts).exec(this.client);

  /**
   * @see https://upstash.com/docs/redis/commands/array/arset
   * @see node_modules/@upstash/redis/docs/commands/array/arset.mdx
   */
  arset = <TData>(key: string, index: number | string, ...values: TData[]) =>
    new ArSetCommand<TData>([key, index, ...values], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/bitcount
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitcount.mdx
   */
  bitcount = (...args: CommandArgs<typeof BitCountCommand>) =>
    new BitCountCommand(args, this.opts).exec(this.client);

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
    ): Promise<number>;
    (op: "not", destinationKey: string, sourceKey: string): Promise<number>;
    (
      op: "diff" | "diff1" | "andor",
      destinationKey: string,
      x: string,
      ...y: string[]
    ): Promise<number>;
    (op: "one", destinationKey: string, ...sourceKeys: string[]): Promise<number>;
  } = (
    op: "and" | "or" | "xor" | "not" | "diff" | "diff1" | "andor" | "one",
    destinationKey: string,
    sourceKey: string,
    ...sourceKeys: string[]
  ) =>
    new BitOpCommand([op as any, destinationKey, sourceKey, ...sourceKeys], this.opts).exec(
      this.client
    );

  /**
   * @see https://redis.io/commands/bitpos
   * @see node_modules/@upstash/redis/docs/commands/bitmap/bitpos.mdx
   */
  bitpos = (...args: CommandArgs<typeof BitPosCommand>) =>
    new BitPosCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/client-setinfo
   * @see node_modules/@upstash/redis/docs/commands/connection/client_setinfo.mdx
   */
  clientSetinfo = (...args: CommandArgs<typeof ClientSetInfoCommand>) =>
    new ClientSetInfoCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/copy
   */
  copy = (...args: CommandArgs<typeof CopyCommand>) =>
    new CopyCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/dbsize
   * @see node_modules/@upstash/redis/docs/commands/server/dbsize.mdx
   */
  dbsize = () => new DBSizeCommand(this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/decr
   * @see node_modules/@upstash/redis/docs/commands/string/decr.mdx
   */
  decr = (...args: CommandArgs<typeof DecrCommand>) =>
    new DecrCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/decrby
   * @see node_modules/@upstash/redis/docs/commands/string/decrby.mdx
   */
  decrby = (...args: CommandArgs<typeof DecrByCommand>) =>
    new DecrByCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/del
   * @see node_modules/@upstash/redis/docs/commands/generic/del.mdx
   */
  del = (...args: CommandArgs<typeof DelCommand>) =>
    new DelCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/echo
   * @see node_modules/@upstash/redis/docs/commands/auth/echo.mdx
   */
  echo = (...args: CommandArgs<typeof EchoCommand>) =>
    new EchoCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/eval_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval_ro.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalRo = <TArgs extends unknown[], TData = unknown>(
    ...args: [script: string, keys: string[], args: TArgs]
  ) => new EvalROCommand<TArgs, TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/eval
   * @see node_modules/@upstash/redis/docs/commands/scripts/eval.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  eval = <TArgs extends unknown[], TData = unknown>(
    ...args: [script: string, keys: string[], args: TArgs]
  ) => new EvalCommand<TArgs, TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/evalsha_ro
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha_ro.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalshaRo = <TArgs extends unknown[], TData = unknown>(
    ...args: [sha1: string, keys: string[], args: TArgs]
  ) => new EvalshaROCommand<TArgs, TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/evalsha
   * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  evalsha = <TArgs extends unknown[], TData = unknown>(
    ...args: [sha1: string, keys: string[], args: TArgs]
  ) => new EvalshaCommand<TArgs, TData>(args, this.opts).exec(this.client);

  /**
   * Generic method to execute any Redis command.
   */
  exec = <TResult>(args: [command: string, ...args: (string | number | boolean)[]]) =>
    new ExecCommand<TResult>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/exists
   * @see node_modules/@upstash/redis/docs/commands/generic/exists.mdx
   */
  exists = (...args: CommandArgs<typeof ExistsCommand>) =>
    new ExistsCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/expire
   * @see node_modules/@upstash/redis/docs/commands/generic/expire.mdx
   */
  expire = (...args: CommandArgs<typeof ExpireCommand>) =>
    new ExpireCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/expireat
   * @see node_modules/@upstash/redis/docs/commands/generic/expireat.mdx
   */
  expireat = (...args: CommandArgs<typeof ExpireAtCommand>) =>
    new ExpireAtCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/flushall
   * @see node_modules/@upstash/redis/docs/commands/server/flushall.mdx
   */
  flushall = (args?: CommandArgs<typeof FlushAllCommand>) =>
    new FlushAllCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/flushdb
   * @see node_modules/@upstash/redis/docs/commands/server/flushdb.mdx
   */
  flushdb = (...args: CommandArgs<typeof FlushDBCommand>) =>
    new FlushDBCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geoadd
   */
  geoadd = <TData>(...args: CommandArgs<typeof GeoAddCommand<TData>>) =>
    new GeoAddCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geopos
   */
  geopos = <TData>(...args: CommandArgs<typeof GeoPosCommand<TData>>) =>
    new GeoPosCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geodist
   */
  geodist = <TData>(...args: CommandArgs<typeof GeoDistCommand<TData>>) =>
    new GeoDistCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geohash
   */
  geohash = <TData>(...args: CommandArgs<typeof GeoHashCommand<TData>>) =>
    new GeoHashCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geosearch
   */
  geosearch = <TData>(...args: CommandArgs<typeof GeoSearchCommand<TData>>) =>
    new GeoSearchCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/geosearchstore
   */
  geosearchstore = <TData>(...args: CommandArgs<typeof GeoSearchStoreCommand<TData>>) =>
    new GeoSearchStoreCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/get
   * @see node_modules/@upstash/redis/docs/commands/string/get.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  get = <TData>(...args: CommandArgs<typeof GetCommand>) =>
    new GetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/getbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/getbit.mdx
   */
  getbit = (...args: CommandArgs<typeof GetBitCommand>) =>
    new GetBitCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/getdel
   * @see node_modules/@upstash/redis/docs/commands/string/getdel.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  getdel = <TData>(...args: CommandArgs<typeof GetDelCommand>) =>
    new GetDelCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/getex
   */
  getex = <TData>(...args: CommandArgs<typeof GetExCommand>) =>
    new GetExCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/getrange
   * @see node_modules/@upstash/redis/docs/commands/string/getrange.mdx
   */
  getrange = (...args: CommandArgs<typeof GetRangeCommand>) =>
    new GetRangeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/getset
   * @see node_modules/@upstash/redis/docs/commands/string/getset.mdx
   */
  getset = <TData>(key: string, value: TData) =>
    new GetSetCommand<TData>([key, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hdel.mdx
   */
  hdel = (...args: CommandArgs<typeof HDelCommand>) =>
    new HDelCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hexists
   * @see node_modules/@upstash/redis/docs/commands/hash/hexists.mdx
   */
  hexists = (...args: CommandArgs<typeof HExistsCommand>) =>
    new HExistsCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpire.mdx
   */
  hexpire = (...args: CommandArgs<typeof HExpireCommand>) =>
    new HExpireCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpireat.mdx
   */
  hexpireat = (...args: CommandArgs<typeof HExpireAtCommand>) =>
    new HExpireAtCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hexpiretime.mdx
   */
  hexpiretime = (...args: CommandArgs<typeof HExpireTimeCommand>) =>
    new HExpireTimeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/httl
   * @see node_modules/@upstash/redis/docs/commands/hash/httl.mdx
   */
  httl = (...args: CommandArgs<typeof HTtlCommand>) =>
    new HTtlCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hpexpire
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpire.mdx
   */
  hpexpire = (...args: CommandArgs<typeof HPExpireCommand>) =>
    new HPExpireCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hpexpireat
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpireat.mdx
   */
  hpexpireat = (...args: CommandArgs<typeof HPExpireAtCommand>) =>
    new HPExpireAtCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hpexpiretime
   * @see node_modules/@upstash/redis/docs/commands/hash/hpexpiretime.mdx
   */
  hpexpiretime = (...args: CommandArgs<typeof HPExpireTimeCommand>) =>
    new HPExpireTimeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hpttl
   * @see node_modules/@upstash/redis/docs/commands/hash/hpttl.mdx
   */
  hpttl = (...args: CommandArgs<typeof HPTtlCommand>) =>
    new HPTtlCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hpersist
   * @see node_modules/@upstash/redis/docs/commands/hash/hpersist.mdx
   */
  hpersist = (...args: CommandArgs<typeof HPersistCommand>) =>
    new HPersistCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hget
   * @see node_modules/@upstash/redis/docs/commands/hash/hget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  hget = <TData>(...args: CommandArgs<typeof HGetCommand>) =>
    new HGetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hgetall
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetall.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   * With automaticDeserialization: false, hgetall returns a flat array instead, such as
   * ["text", "123", "version", "1"], and [] for a missing key.
   */
  hgetall = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetAllCommand>) =>
    new HGetAllCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hgetdel
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetdel.mdx
   */
  hgetdel = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetDelCommand>) =>
    new HGetDelCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hgetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hgetex.mdx
   */
  hgetex = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HGetExCommand>) =>
    new HGetExCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hincrby
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrby.mdx
   */
  hincrby = (...args: CommandArgs<typeof HIncrByCommand>) =>
    new HIncrByCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hincrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/hash/hincrbyfloat.mdx
   */
  hincrbyfloat = (...args: CommandArgs<typeof HIncrByFloatCommand>) =>
    new HIncrByFloatCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hkeys
   * @see node_modules/@upstash/redis/docs/commands/hash/hkeys.mdx
   */
  hkeys = (...args: CommandArgs<typeof HKeysCommand>) =>
    new HKeysCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hlen.mdx
   */
  hlen = (...args: CommandArgs<typeof HLenCommand>) =>
    new HLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hmget
   * @see node_modules/@upstash/redis/docs/commands/hash/hmget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  hmget = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof HMGetCommand>) =>
    new HMGetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hmset
   */
  hmset = <TData>(key: string, kv: Record<string, TData>) =>
    new HMSetCommand([key, kv], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hrandfield
   * @see node_modules/@upstash/redis/docs/commands/hash/hrandfield.mdx
   */
  hrandfield: {
    (key: string): Promise<string | null>;
    (key: string, count: number): Promise<string[]>;
    <TData extends Record<string, unknown>>(
      key: string,
      count: number,
      withValues: boolean
    ): Promise<Partial<TData>>;
  } = <TData extends string | string[] | Record<string, unknown>>(
    key: string,
    count?: number,
    withValues?: boolean
  ) => new HRandFieldCommand<TData>([key, count, withValues] as any, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hscan
   * @see node_modules/@upstash/redis/docs/commands/hash/hscan.mdx
   */
  hscan = (...args: CommandArgs<typeof HScanCommand>) =>
    new HScanCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hset
   * @see node_modules/@upstash/redis/docs/commands/hash/hset.mdx
   */
  hset = <TData>(key: string, kv: Record<string, TData>) =>
    new HSetCommand<TData>([key, kv], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hsetex
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetex.mdx
   */
  hsetex = <TData>(...args: CommandArgs<typeof HSetExCommand<TData>>) =>
    new HSetExCommand<TData>(args as any, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hsetnx
   * @see node_modules/@upstash/redis/docs/commands/hash/hsetnx.mdx
   */
  hsetnx = <TData>(key: string, field: string, value: TData) =>
    new HSetNXCommand<TData>([key, field, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hstrlen
   * @see node_modules/@upstash/redis/docs/commands/hash/hstrlen.mdx
   */
  hstrlen = (...args: CommandArgs<typeof HStrLenCommand>) =>
    new HStrLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/hvals
   * @see node_modules/@upstash/redis/docs/commands/hash/hvals.mdx
   */
  hvals = (...args: CommandArgs<typeof HValsCommand>) =>
    new HValsCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/incr
   * @see node_modules/@upstash/redis/docs/commands/string/incr.mdx
   */
  incr = (...args: CommandArgs<typeof IncrCommand>) =>
    new IncrCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/incrby
   * @see node_modules/@upstash/redis/docs/commands/string/incrby.mdx
   */
  incrby = (...args: CommandArgs<typeof IncrByCommand>) =>
    new IncrByCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/incrbyfloat
   * @see node_modules/@upstash/redis/docs/commands/string/incrbyfloat.mdx
   */
  incrbyfloat = (...args: CommandArgs<typeof IncrByFloatCommand>) =>
    new IncrByFloatCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/keys
   * @see node_modules/@upstash/redis/docs/commands/generic/keys.mdx
   */
  keys = (...args: CommandArgs<typeof KeysCommand>) =>
    new KeysCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lindex
   * @see node_modules/@upstash/redis/docs/commands/list/lindex.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lindex = (...args: CommandArgs<typeof LIndexCommand>) =>
    new LIndexCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/linsert
   * @see node_modules/@upstash/redis/docs/commands/list/linsert.mdx
   */
  linsert = <TData>(key: string, direction: "before" | "after", pivot: TData, value: TData) =>
    new LInsertCommand<TData>([key, direction, pivot, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/llen
   * @see node_modules/@upstash/redis/docs/commands/list/llen.mdx
   */
  llen = (...args: CommandArgs<typeof LLenCommand>) =>
    new LLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lmove
   * @see node_modules/@upstash/redis/docs/commands/list/lmove.mdx
   */
  lmove = <TData = string>(...args: CommandArgs<typeof LMoveCommand>) =>
    new LMoveCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lpop
   * @see node_modules/@upstash/redis/docs/commands/list/lpop.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lpop = <TData>(...args: CommandArgs<typeof LPopCommand>) =>
    new LPopCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lmpop
   */
  lmpop = <TData>(...args: CommandArgs<typeof LmPopCommand>) =>
    new LmPopCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lpos
   * @see node_modules/@upstash/redis/docs/commands/list/lpos.mdx
   */
  lpos = <TData = number>(...args: CommandArgs<typeof LPosCommand>) =>
    new LPosCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lpush
   * @see node_modules/@upstash/redis/docs/commands/list/lpush.mdx
   */
  lpush = <TData>(key: string, ...elements: TData[]) =>
    new LPushCommand<TData>([key, ...elements], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lpushx
   * @see node_modules/@upstash/redis/docs/commands/list/lpushx.mdx
   */
  lpushx = <TData>(key: string, ...elements: TData[]) =>
    new LPushXCommand<TData>([key, ...elements], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lrange
   * @see node_modules/@upstash/redis/docs/commands/list/lrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  lrange = <TResult = string>(...args: CommandArgs<typeof LRangeCommand>) =>
    new LRangeCommand<TResult>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lrem
   * @see node_modules/@upstash/redis/docs/commands/list/lrem.mdx
   */
  lrem = <TData>(key: string, count: number, value: TData) =>
    new LRemCommand([key, count, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/lset
   * @see node_modules/@upstash/redis/docs/commands/list/lset.mdx
   */
  lset = <TData>(key: string, index: number, value: TData) =>
    new LSetCommand([key, index, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/ltrim
   * @see node_modules/@upstash/redis/docs/commands/list/ltrim.mdx
   */
  ltrim = (...args: CommandArgs<typeof LTrimCommand>) =>
    new LTrimCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/mget
   * @see node_modules/@upstash/redis/docs/commands/string/mget.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  mget = <TData extends unknown[]>(...args: CommandArgs<typeof MGetCommand>) =>
    new MGetCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/mset
   * @see node_modules/@upstash/redis/docs/commands/string/mset.mdx
   */
  mset = <TData>(kv: Record<string, TData>) =>
    new MSetCommand<TData>([kv], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/msetnx
   * @see node_modules/@upstash/redis/docs/commands/string/msetnx.mdx
   */
  msetnx = <TData>(kv: Record<string, TData>) =>
    new MSetNXCommand<TData>([kv], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/persist
   * @see node_modules/@upstash/redis/docs/commands/generic/persist.mdx
   */
  persist = (...args: CommandArgs<typeof PersistCommand>) =>
    new PersistCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/pexpire
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpire.mdx
   */
  pexpire = (...args: CommandArgs<typeof PExpireCommand>) =>
    new PExpireCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/pexpireat
   * @see node_modules/@upstash/redis/docs/commands/generic/pexpireat.mdx
   */
  pexpireat = (...args: CommandArgs<typeof PExpireAtCommand>) =>
    new PExpireAtCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/pfadd
   */
  pfadd = (...args: CommandArgs<typeof PfAddCommand>) =>
    new PfAddCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/pfcount
   */
  pfcount = (...args: CommandArgs<typeof PfCountCommand>) =>
    new PfCountCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/pfmerge
   */
  pfmerge = (...args: CommandArgs<typeof PfMergeCommand>) =>
    new PfMergeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/ping
   * @see node_modules/@upstash/redis/docs/commands/auth/ping.mdx
   */
  ping = (args?: CommandArgs<typeof PingCommand>) =>
    new PingCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/psetex
   */
  psetex = <TData>(key: string, ttl: number, value: TData) =>
    new PSetEXCommand<TData>([key, ttl, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/psubscribe
   * @see node_modules/@upstash/redis/docs/commands/pubsub/psubscribe.mdx
   */
  psubscribe = <TMessage>(patterns: string | string[]): Subscriber<TMessage> => {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    return new Subscriber<TMessage>(this.client, patternArray, true, this.opts);
  };

  /**
   * @see https://redis.io/commands/pttl
   * @see node_modules/@upstash/redis/docs/commands/generic/pttl.mdx
   */
  pttl = (...args: CommandArgs<typeof PTtlCommand>) =>
    new PTtlCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/publish
   * @see node_modules/@upstash/redis/docs/commands/pubsub/publish.mdx
   */
  publish = (...args: CommandArgs<typeof PublishCommand>) =>
    new PublishCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/randomkey
   * @see node_modules/@upstash/redis/docs/commands/generic/randomkey.mdx
   */
  randomkey = () => new RandomKeyCommand().exec(this.client);

  /**
   * @see https://redis.io/commands/rename
   * @see node_modules/@upstash/redis/docs/commands/generic/rename.mdx
   */
  rename = (...args: CommandArgs<typeof RenameCommand>) =>
    new RenameCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/renamenx
   * @see node_modules/@upstash/redis/docs/commands/generic/renamenx.mdx
   */
  renamenx = (...args: CommandArgs<typeof RenameNXCommand>) =>
    new RenameNXCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/rpop
   * @see node_modules/@upstash/redis/docs/commands/list/rpop.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  rpop = <TData = string>(...args: CommandArgs<typeof RPopCommand>) =>
    new RPopCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/rpush
   * @see node_modules/@upstash/redis/docs/commands/list/rpush.mdx
   */
  rpush = <TData>(key: string, ...elements: TData[]) =>
    new RPushCommand([key, ...elements], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/rpushx
   * @see node_modules/@upstash/redis/docs/commands/list/rpushx.mdx
   */
  rpushx = <TData>(key: string, ...elements: TData[]) =>
    new RPushXCommand([key, ...elements], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sadd
   * @see node_modules/@upstash/redis/docs/commands/set/sadd.mdx
   */
  sadd = <TData>(key: string, member: TData, ...members: TData[]) =>
    new SAddCommand<TData>([key, member, ...members], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/scan
   * @see node_modules/@upstash/redis/docs/commands/generic/scan.mdx
   */
  scan(cursor: string | number): Promise<ScanResultStandard>;
  scan<TOptions extends ScanCommandOptions>(
    cursor: string | number,
    opts: TOptions
  ): Promise<TOptions extends { withType: true } ? ScanResultWithType : ScanResultStandard>;
  scan<TOptions extends ScanCommandOptions>(
    cursor: string | number,
    opts?: TOptions
  ): Promise<TOptions extends { withType: true } ? ScanResultWithType : ScanResultStandard> {
    return new ScanCommand([cursor, opts], this.opts).exec(this.client);
  }

  /**
   * @see https://redis.io/commands/scard
   * @see node_modules/@upstash/redis/docs/commands/set/scard.mdx
   */
  scard = (...args: CommandArgs<typeof SCardCommand>) =>
    new SCardCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/script-exists
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_exists.mdx
   */
  scriptExists = (...args: CommandArgs<typeof ScriptExistsCommand>) =>
    new ScriptExistsCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/script-flush
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_flush.mdx
   */
  scriptFlush = (...args: CommandArgs<typeof ScriptFlushCommand>) =>
    new ScriptFlushCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/script-load
   * @see node_modules/@upstash/redis/docs/commands/scripts/script_load.mdx
   */
  scriptLoad = (...args: CommandArgs<typeof ScriptLoadCommand>) =>
    new ScriptLoadCommand(args, this.opts).exec(this.client);
  /**
   * @see https://redis.io/commands/sdiff
   * @see node_modules/@upstash/redis/docs/commands/set/sdiff.mdx
   */
  sdiff = (...args: CommandArgs<typeof SDiffCommand>) =>
    new SDiffCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sdiffstore
   * @see node_modules/@upstash/redis/docs/commands/set/sdiffstore.mdx
   */
  sdiffstore = (...args: CommandArgs<typeof SDiffStoreCommand>) =>
    new SDiffStoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/set
   * @see node_modules/@upstash/redis/docs/commands/string/set.mdx
   */
  set = <TData>(key: string, value: TData, opts?: SetCommandOptions) =>
    new SetCommand<TData>([key, value, opts], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/setbit
   * @see node_modules/@upstash/redis/docs/commands/bitmap/setbit.mdx
   */
  setbit = (...args: CommandArgs<typeof SetBitCommand>) =>
    new SetBitCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/setex
   */
  setex = <TData>(key: string, ttl: number, value: TData) =>
    new SetExCommand<TData>([key, ttl, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/setnx
   */
  setnx = <TData>(key: string, value: TData) =>
    new SetNxCommand<TData>([key, value], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/setrange
   * @see node_modules/@upstash/redis/docs/commands/string/setrange.mdx
   */
  setrange = (...args: CommandArgs<typeof SetRangeCommand>) =>
    new SetRangeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sinter
   * @see node_modules/@upstash/redis/docs/commands/set/sinter.mdx
   */
  sinter = (...args: CommandArgs<typeof SInterCommand>) =>
    new SInterCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sintercard
   */
  sintercard = (...args: CommandArgs<typeof SInterCardCommand>) =>
    new SInterCardCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sinterstore
   * @see node_modules/@upstash/redis/docs/commands/set/sinterstore.mdx
   */
  sinterstore = (...args: CommandArgs<typeof SInterStoreCommand>) =>
    new SInterStoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sismember
   * @see node_modules/@upstash/redis/docs/commands/set/sismember.mdx
   */
  sismember = <TData>(key: string, member: TData) =>
    new SIsMemberCommand<TData>([key, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/smismember
   * @see node_modules/@upstash/redis/docs/commands/set/smismember.mdx
   */
  smismember = <TMembers extends unknown[]>(key: string, members: TMembers) =>
    new SMIsMemberCommand<TMembers>([key, members], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/smembers
   * @see node_modules/@upstash/redis/docs/commands/set/smembers.mdx
   */
  smembers = <TData extends unknown[] = string[]>(...args: CommandArgs<typeof SMembersCommand>) =>
    new SMembersCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/smove
   * @see node_modules/@upstash/redis/docs/commands/set/smove.mdx
   */
  smove = <TData>(source: string, destination: string, member: TData) =>
    new SMoveCommand<TData>([source, destination, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/spop
   * @see node_modules/@upstash/redis/docs/commands/set/spop.mdx
   */
  spop = <TData>(...args: CommandArgs<typeof SPopCommand>) =>
    new SPopCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/srandmember
   * @see node_modules/@upstash/redis/docs/commands/set/srandmember.mdx
   */
  srandmember = <TData>(...args: CommandArgs<typeof SRandMemberCommand>) =>
    new SRandMemberCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/srem
   * @see node_modules/@upstash/redis/docs/commands/set/srem.mdx
   */
  srem = <TData>(key: string, ...members: TData[]) =>
    new SRemCommand<TData>([key, ...members], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sscan
   * @see node_modules/@upstash/redis/docs/commands/set/sscan.mdx
   */
  sscan = (...args: CommandArgs<typeof SScanCommand>) =>
    new SScanCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/strlen
   * @see node_modules/@upstash/redis/docs/commands/string/strlen.mdx
   */
  strlen = (...args: CommandArgs<typeof StrLenCommand>) =>
    new StrLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/subscribe
   * @see node_modules/@upstash/redis/docs/commands/pubsub/subscribe.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  subscribe = <TMessage>(channels: string | string[]): Subscriber<TMessage> => {
    const channelArray = Array.isArray(channels) ? channels : [channels];
    return new Subscriber<TMessage>(this.client, channelArray, false, this.opts);
  };
  /**
   * @see https://redis.io/commands/sunion
   * @see node_modules/@upstash/redis/docs/commands/set/sunion.mdx
   */
  sunion = (...args: CommandArgs<typeof SUnionCommand>) =>
    new SUnionCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/sunionstore
   * @see node_modules/@upstash/redis/docs/commands/set/sunionstore.mdx
   */
  sunionstore = (...args: CommandArgs<typeof SUnionStoreCommand>) =>
    new SUnionStoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/time
   */
  time = () => new TimeCommand().exec(this.client);

  /**
   * @see https://redis.io/commands/touch
   * @see node_modules/@upstash/redis/docs/commands/generic/touch.mdx
   */
  touch = (...args: CommandArgs<typeof TouchCommand>) =>
    new TouchCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/ttl
   * @see node_modules/@upstash/redis/docs/commands/generic/ttl.mdx
   */
  ttl = (...args: CommandArgs<typeof TtlCommand>) =>
    new TtlCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/type
   * @see node_modules/@upstash/redis/docs/commands/generic/type.mdx
   */
  type = (...args: CommandArgs<typeof TypeCommand>) =>
    new TypeCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/unlink
   * @see node_modules/@upstash/redis/docs/commands/generic/unlink.mdx
   */
  unlink = (...args: CommandArgs<typeof UnlinkCommand>) =>
    new UnlinkCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xadd
   * @see node_modules/@upstash/redis/docs/commands/stream/xadd.mdx
   */
  xadd = (...args: CommandArgs<typeof XAddCommand>) =>
    new XAddCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xack
   * @see node_modules/@upstash/redis/docs/commands/stream/xack.mdx
   */
  xack = (...args: CommandArgs<typeof XAckCommand>) =>
    new XAckCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xackdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xackdel.mdx
   */
  xackdel = (...args: CommandArgs<typeof XAckDelCommand>) =>
    new XAckDelCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xdel
   * @see node_modules/@upstash/redis/docs/commands/stream/xdel.mdx
   */
  xdel = (...args: CommandArgs<typeof XDelCommand>) =>
    new XDelCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xdelex
   * @see node_modules/@upstash/redis/docs/commands/stream/xdelex.mdx
   */
  xdelex = (...args: CommandArgs<typeof XDelExCommand>) =>
    new XDelExCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xgroup.mdx
   */
  xgroup = (...args: CommandArgs<typeof XGroupCommand>) =>
    new XGroupCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xread
   * @see node_modules/@upstash/redis/docs/commands/stream/xread.mdx
   */
  xread = (...args: CommandArgs<typeof XReadCommand>) =>
    new XReadCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xreadgroup
   * @see node_modules/@upstash/redis/docs/commands/stream/xreadgroup.mdx
   */
  xreadgroup = (...args: CommandArgs<typeof XReadGroupCommand>) =>
    new XReadGroupCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xinfo
   * @see node_modules/@upstash/redis/docs/commands/stream/xinfo.mdx
   */
  xinfo = (...args: CommandArgs<typeof XInfoCommand>) =>
    new XInfoCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xlen
   * @see node_modules/@upstash/redis/docs/commands/stream/xlen.mdx
   */
  xlen = (...args: CommandArgs<typeof XLenCommand>) =>
    new XLenCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xpending
   * @see node_modules/@upstash/redis/docs/commands/stream/xpending.mdx
   */
  xpending = (...args: CommandArgs<typeof XPendingCommand>) =>
    new XPendingCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xclaim.mdx
   */
  xclaim = (...args: CommandArgs<typeof XClaimCommand>) =>
    new XClaimCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xautoclaim
   * @see node_modules/@upstash/redis/docs/commands/stream/xautoclaim.mdx
   */
  xautoclaim = (...args: CommandArgs<typeof XAutoClaim>) =>
    new XAutoClaim(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xtrim
   * @see node_modules/@upstash/redis/docs/commands/stream/xtrim.mdx
   */
  xtrim = (...args: CommandArgs<typeof XTrimCommand>) =>
    new XTrimCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  xrange = <TData extends Record<string, unknown>>(...args: CommandArgs<typeof XRangeCommand>) =>
    new XRangeCommand<Record<string, TData>>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/xrevrange
   * @see node_modules/@upstash/redis/docs/commands/stream/xrevrange.mdx
   * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
   * automaticDeserialization: false to the Redis constructor to receive raw strings.
   */
  xrevrange = <TData extends Record<string, unknown>>(
    ...args: CommandArgs<typeof XRevRangeCommand>
  ) => new XRevRangeCommand<Record<string, TData>>(args, this.opts).exec(this.client);

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
      return new ZAddCommand<TData>([args[0], args[1], ...(args.slice(2) as any)], this.opts).exec(
        this.client
      );
    }

    return new ZAddCommand<TData>(
      [args[0], args[1] as any, ...(args.slice(2) as any)],
      this.opts
    ).exec(this.client);
  };
  /**
   * @see https://redis.io/commands/zcard
   * @see node_modules/@upstash/redis/docs/commands/zset/zcard.mdx
   */
  zcard = (...args: CommandArgs<typeof ZCardCommand>) =>
    new ZCardCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zcount.mdx
   */
  zcount = (...args: CommandArgs<typeof ZCountCommand>) =>
    new ZCountCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zdiffstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zdiffstore.mdx
   */
  zdiffstore = (...args: CommandArgs<typeof ZDiffStoreCommand>) =>
    new ZDiffStoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zincrby
   * @see node_modules/@upstash/redis/docs/commands/zset/zincrby.mdx
   */
  zincrby = <TData>(key: string, increment: number, member: TData) =>
    new ZIncrByCommand<TData>([key, increment, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zinterstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zinterstore.mdx
   */
  zinterstore = (...args: CommandArgs<typeof ZInterStoreCommand>) =>
    new ZInterStoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zlexcount
   * @see node_modules/@upstash/redis/docs/commands/zset/zlexcount.mdx
   */
  zlexcount = (...args: CommandArgs<typeof ZLexCountCommand>) =>
    new ZLexCountCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zmscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zmscore.mdx
   */
  zmscore = (...args: CommandArgs<typeof ZMScoreCommand>) =>
    new ZMScoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zpopmax
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmax.mdx
   */
  zpopmax = <TData>(...args: CommandArgs<typeof ZPopMaxCommand>) =>
    new ZPopMaxCommand<TData>(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zpopmin
   * @see node_modules/@upstash/redis/docs/commands/zset/zpopmin.mdx
   */
  zpopmin = <TData>(...args: CommandArgs<typeof ZPopMinCommand>) =>
    new ZPopMinCommand<TData>(args, this.opts).exec(this.client);

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
  ) => new ZRangeCommand<TData>(args as any, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrank.mdx
   */
  zrank = <TData>(key: string, member: TData) =>
    new ZRankCommand<TData>([key, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zrem
   * @see node_modules/@upstash/redis/docs/commands/zset/zrem.mdx
   */
  zrem = <TData>(key: string, ...members: TData[]) =>
    new ZRemCommand<TData>([key, ...members], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zremrangebylex
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebylex.mdx
   */
  zremrangebylex = (...args: CommandArgs<typeof ZRemRangeByLexCommand>) =>
    new ZRemRangeByLexCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zremrangebyrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyrank.mdx
   */
  zremrangebyrank = (...args: CommandArgs<typeof ZRemRangeByRankCommand>) =>
    new ZRemRangeByRankCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zremrangebyscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zremrangebyscore.mdx
   */
  zremrangebyscore = (...args: CommandArgs<typeof ZRemRangeByScoreCommand>) =>
    new ZRemRangeByScoreCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zrevrank
   * @see node_modules/@upstash/redis/docs/commands/zset/zrevrank.mdx
   */
  zrevrank = <TData>(key: string, member: TData) =>
    new ZRevRankCommand<TData>([key, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zscan
   * @see node_modules/@upstash/redis/docs/commands/zset/zscan.mdx
   */
  zscan = (...args: CommandArgs<typeof ZScanCommand>) =>
    new ZScanCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zscore
   * @see node_modules/@upstash/redis/docs/commands/zset/zscore.mdx
   */
  zscore = <TData>(key: string, member: TData) =>
    new ZScoreCommand<TData>([key, member], this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zunion
   */
  zunion = (...args: CommandArgs<typeof ZUnionCommand>) =>
    new ZUnionCommand(args, this.opts).exec(this.client);

  /**
   * @see https://redis.io/commands/zunionstore
   * @see node_modules/@upstash/redis/docs/commands/zset/zunionstore.mdx
   */
  zunionstore = (...args: CommandArgs<typeof ZUnionStoreCommand>) =>
    new ZUnionStoreCommand(args, this.opts).exec(this.client);
}
