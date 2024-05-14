import { Command } from "./commands/command";
import { CommandArgs } from "./types";
import { Pipeline } from "./pipeline";
import { Redis } from "./redis";

// properties which are only available in redis
type redisOnly = Exclude<keyof Redis, keyof Pipeline>

export function createAutoPipelineProxy(_redis: Redis) {

  const redis = _redis as Redis & {
    autoPipelineExecutor: AutoPipelineExecutor;
  }

  if (!redis.autoPipelineExecutor) {
    redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
  }

  return new Proxy(redis, {
    get: (redis, command: "pipelineCounter" | keyof Pipeline | redisOnly ) => {

      // return pipelineCounter of autoPipelineExecutor
      if (command === "pipelineCounter") {
        return redis.autoPipelineExecutor.pipelineCounter;
      }

      const commandInRedisButNotPipeline =
        command in redis && !(command in redis.autoPipelineExecutor.pipeline);

      if (commandInRedisButNotPipeline) {
          return redis[command as redisOnly];
      }

      command = command as keyof Pipeline;
      // If the method is a function on the pipeline, wrap it with the executor logic
      if (typeof redis.autoPipelineExecutor.pipeline[command] === "function") {
        return (...args: CommandArgs<typeof Command>) => {
          // pass the function as a callback
          return redis.autoPipelineExecutor.withAutoPipeline((pipeline) => {
            (pipeline[command] as Function)(...args);
          });
        };
      }

      // if the property is not a function, a property of redis or "pipelineCounter"
      // simply return it from pipeline
      return redis.autoPipelineExecutor.pipeline[command];
    },
  }) as Redis;
}

class AutoPipelineExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<Array<unknown>>>();
  private activePipeline: Pipeline | null = null;
  private indexInCurrentPipeline = 0;
  private redis: Redis;
  pipeline: Pipeline; // only to make sure that proxy can work
  pipelineCounter: number = 0; // to keep track of how many times a pipeline was executed 

  constructor(redis: Redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline();
  }

  async withAutoPipeline<T>(executeWithPipeline: (pipeline: Pipeline) => unknown): Promise<T> {
    const pipeline = this.activePipeline || this.redis.pipeline();

    if (!this.activePipeline) {
      this.activePipeline = pipeline;
      this.indexInCurrentPipeline = 0;
    }

    const index = this.indexInCurrentPipeline++;
    executeWithPipeline(pipeline);

    const pipelineDone = this.deferExecution().then(() => {
      if (!this.pipelinePromises.has(pipeline)) {
        const pipelinePromise = pipeline.exec();
        this.pipelineCounter += 1;

        this.pipelinePromises.set(pipeline, pipelinePromise);
        this.activePipeline = null;
      }
      return this.pipelinePromises.get(pipeline)!;
    });

    const results = await pipelineDone;
    return results[index] as T;
  }

  private async deferExecution() {
    return await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 0);
    });
  }
}