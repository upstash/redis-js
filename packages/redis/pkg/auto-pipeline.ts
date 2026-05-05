import type { Command } from "./commands/command";
import { UpstashError } from "./error";
import type { UpstashResponse } from "./http";
import type { Pipeline } from "./pipeline";
import type { Redis } from "./redis";
import type { CommandArgs } from "./types";

// properties which are only available in redis
type redisOnly = Exclude<keyof Redis, keyof Pipeline>;

export const MAX_PIPELINE_SIZE = 1000;

const READ_COMMANDS: Set<string> = new Set([
  // String
  "get",
  "getrange",
  "mget",
  "strlen",
  // Bit
  "bitcount",
  "bitpos",
  "getbit",
  // Hash
  "hexists",
  "hget",
  "hgetall",
  "hkeys",
  "hlen",
  "hmget",
  "hrandfield",
  "hscan",
  "hstrlen",
  "httl",
  "hvals",
  "hexpiretime",
  "hpexpiretime",
  "hpttl",
  // List
  "lindex",
  "llen",
  "lpos",
  "lrange",
  // Set
  "scard",
  "sdiff",
  "sinter",
  "sintercard",
  "sismember",
  "smembers",
  "smismember",
  "srandmember",
  "sscan",
  "sunion",
  // Sorted set
  "zcard",
  "zcount",
  "zlexcount",
  "zmscore",
  "zrange",
  "zrank",
  "zrevrank",
  "zscan",
  "zscore",
  "zunion",
  // Key metadata
  "exists",
  "type",
  "ttl",
  "pttl",
  "randomkey",
  "touch",
  // HyperLogLog
  "pfcount",
  // Stream
  "xinfo",
  "xlen",
  "xpending",
  "xrange",
  "xread",
  "xrevrange",
  // Geo
  "geodist",
  "geohash",
  "geopos",
  "geosearch",
  // Script / eval
  "scriptExists",
  "evalRo",
  "evalshaRo",
  // Utility
  "dbsize",
  "echo",
  "ping",
  "time",
  "scan",
  "keys",
  // JSON namespace
  "arrindex",
  "arrlen",
  "objkeys",
  "objlen",
  "resp",
  // Functions namespace
  "list",
  "stats",
  "callRo",
]);

export const EXCLUDE_COMMANDS: Set<keyof Redis> = new Set([
  "scan",
  "keys",
  "flushdb",
  "flushall",
  "dbsize",
  "hscan",
  "hgetall",
  "hkeys",
  "lrange",
  "sscan",
  "smembers",
  "xrange",
  "xrevrange",
  "zscan",
  "zrange",
  "exec",
]);

type AutoPipelineNamespace = "root" | "json" | "functions";

export function createAutoPipelineProxy(
  _redis: Redis,
  namespace: AutoPipelineNamespace = "root"
): Redis {
  const redis = _redis as Redis & {
    autoPipelineExecutor: AutoPipelineExecutor;
  };

  if (!redis.autoPipelineExecutor) {
    redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
  }

  return new Proxy(redis, {
    get: (redis, command: "pipelineCounter" | keyof Pipeline | redisOnly) => {
      // return pipelineCounter of autoPipelineExecutor
      if (command === "pipelineCounter") {
        return redis.autoPipelineExecutor.pipelineCounter;
      }

      // Namespace switching
      if (namespace === "root" && command === "json") {
        return createAutoPipelineProxy(redis, "json");
      }
      if (namespace === "root" && command === "functions") {
        return createAutoPipelineProxy(redis, "functions");
      }

      // Root-level: some commands should bypass auto pipelining
      if (namespace === "root") {
        const commandInRedisButNotPipeline =
          command in redis && !(command in redis.autoPipelineExecutor.pipeline);
        const isCommandExcluded = EXCLUDE_COMMANDS.has(command as keyof Redis);

        if (commandInRedisButNotPipeline || isCommandExcluded) {
          return redis[command as redisOnly];
        }
      }

      const pipeline = redis.autoPipelineExecutor.pipeline;
      const targetFunction =
        namespace === "json"
          ? pipeline.json[command as keyof typeof pipeline.json]
          : namespace === "functions"
            ? pipeline.functions[command as keyof typeof pipeline.functions]
            : pipeline[command as keyof Pipeline];

      const isFunction = typeof targetFunction === "function";
      if (isFunction) {
        return (...args: CommandArgs<typeof Command>) => {
          const commandMode = READ_COMMANDS.has(command as string) ? "read" : "write";
          return redis.autoPipelineExecutor.withAutoPipeline(commandMode, (pipeline) => {
            const targetFunction =
              namespace === "json"
                ? pipeline.json[command as keyof typeof pipeline.json]
                : namespace === "functions"
                  ? pipeline.functions[command as keyof typeof pipeline.functions]
                  : pipeline[command as keyof Pipeline];

            (targetFunction as any)(...args);
          });
        };
      }

      return targetFunction;
    },
  }) as Redis;
}

type CommandMode = "read" | "write";

class AutoPipelineExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<unknown[]>>();
  private activeReadPipeline: Pipeline | null = null;
  private activeWritePipeline: Pipeline | null = null;
  private readIndex = 0;
  private writeIndex = 0;
  private redis: Redis;
  pipeline: Pipeline; // only to make sure that proxy can work
  pipelineCounter = 0; // to keep track of how many times a pipeline was executed

  constructor(redis: Redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline();
  }

  async withAutoPipeline<T>(
    commandMode: CommandMode,
    executeWithPipeline: (pipeline: Pipeline) => unknown
  ): Promise<T> {
    const isRead = commandMode === "read";
    const activePipeline = isRead ? this.activeReadPipeline : this.activeWritePipeline;
    const pipeline = activePipeline ?? this.redis.pipeline();

    if (!activePipeline) {
      if (isRead) {
        this.activeReadPipeline = pipeline;
        this.readIndex = 0;
      } else {
        this.activeWritePipeline = pipeline;
        this.writeIndex = 0;
      }
    }

    const index = isRead ? this.readIndex++ : this.writeIndex++;
    executeWithPipeline(pipeline);

    // If pipeline reached max size, close it so next command starts a new pipeline
    if (isRead && this.readIndex >= MAX_PIPELINE_SIZE) {
      this.activeReadPipeline = null;
    } else if (!isRead && this.writeIndex >= MAX_PIPELINE_SIZE) {
      this.activeWritePipeline = null;
    }

    const pipelineDone = this.deferExecution().then(() => {
      if (!this.pipelinePromises.has(pipeline)) {
        const pipelinePromise = pipeline.exec({ keepErrors: true });
        this.pipelineCounter += 1;

        this.pipelinePromises.set(pipeline, pipelinePromise);
        if (this.activeReadPipeline === pipeline) {
          this.activeReadPipeline = null;
        }
        if (this.activeWritePipeline === pipeline) {
          this.activeWritePipeline = null;
        }
      }

      return this.pipelinePromises.get(pipeline)!;
    });

    const results = (await pipelineDone) as UpstashResponse<T>[];
    const commandResult = results[index];
    if (commandResult.error) {
      throw new UpstashError(`Command failed: ${commandResult.error}`);
    }
    return commandResult.result as T;
  }

  private async deferExecution() {
    await Promise.resolve();
    await Promise.resolve();
  }
}
