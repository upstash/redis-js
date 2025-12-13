import type { Command } from "./commands/command";
import { UpstashError } from "./error";
import type { UpstashResponse } from "./http";
import type { Pipeline } from "./pipeline";
import type { Redis } from "./redis";
import type { CommandArgs } from "./types";

// properties which are only available in redis
type redisOnly = Exclude<keyof Redis, keyof Pipeline>;

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
          return redis.autoPipelineExecutor.withAutoPipeline((pipeline) => {
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

class AutoPipelineExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<unknown[]>>();
  private activePipeline: Pipeline | null = null;
  private indexInCurrentPipeline = 0;
  private redis: Redis;
  pipeline: Pipeline; // only to make sure that proxy can work
  pipelineCounter = 0; // to keep track of how many times a pipeline was executed

  constructor(redis: Redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline();
  }

  async withAutoPipeline<T>(executeWithPipeline: (pipeline: Pipeline) => unknown): Promise<T> {
    const pipeline = this.activePipeline ?? this.redis.pipeline();

    if (!this.activePipeline) {
      this.activePipeline = pipeline;
      this.indexInCurrentPipeline = 0;
    }

    const index = this.indexInCurrentPipeline++;
    executeWithPipeline(pipeline);

    const pipelineDone = this.deferExecution().then(() => {
      if (!this.pipelinePromises.has(pipeline)) {
        const pipelinePromise = pipeline.exec({ keepErrors: true });
        this.pipelineCounter += 1;

        this.pipelinePromises.set(pipeline, pipelinePromise);
        this.activePipeline = null;
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
