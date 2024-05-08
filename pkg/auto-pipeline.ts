import { Command } from "./commands/command";
import { CommandArgs } from "./types";
import { Pipeline } from "./pipeline";
import { Redis } from "./redis";

export function createAutoPipelineProxy(redis: Redis) {
  redis.prepareAutoPipelineExecutor()

  return new Proxy(redis, {
    get: (target, prop: keyof Pipeline ) => { // omit excluded keys // raise if excluded
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
  });
}

export class AutoPipelineExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<Array<unknown>>>();
  private activePipeline: Pipeline | null = null;
  private indexInCurrentPipeline = 0;
  pipeline: Pipeline; // only to make sure that proxy can work
  redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
    this.pipeline = redis.pipeline()
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
