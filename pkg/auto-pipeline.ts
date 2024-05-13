import { Command } from "./commands/command";
import { Pipeline } from "./pipeline";
import { Redis } from "./redis";
import { CommandArgs } from "./types";

// will omit redis only commands since we call Pipeline in the background in auto pipeline
type redisOnly = Exclude<keyof Redis, keyof Pipeline>;

export function createAutoPipelineProxy(_redis: Redis) {
  const redis = _redis as Redis & {
    autoPipelineExecutor: AutoPipelineExecutor;
  };

  if (!redis.autoPipelineExecutor) {
    redis.autoPipelineExecutor = new AutoPipelineExecutor(redis);
  }

  return new Proxy(redis, {
    get: (target, prop: "pipelineCounter" | keyof Pipeline) => {
      // return pipelineCounter of autoPipelineExecutor
      if (prop === "pipelineCounter") {
        return target.autoPipelineExecutor.pipelineCounter;
      }

      // If the method is a function on the pipeline, wrap it with the executor logic
      if (typeof target.autoPipelineExecutor.pipeline[prop] === "function") {
        return (...args: CommandArgs<typeof Command>) => {
          return target.autoPipelineExecutor.withAutoPipeline((pipeline) => {
            (pipeline[prop] as Function)(...args);
          });
        };
      }
      return target.autoPipelineExecutor.pipeline[prop];
    },
  }) as Omit<Redis, redisOnly>;
}

export class AutoPipelineExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<Array<unknown>>>();
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
    await Promise.resolve();
    return await Promise.resolve();
  }
}
