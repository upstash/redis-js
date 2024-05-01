import { Pipeline } from "./pipeline";

export class RedisAutoPipeline {
  private pipeline: PipelineAutoExecutor;

  constructor(pipeline: Pipeline) {
    this.pipeline = new PipelineAutoExecutor(pipeline);

    // biome-ignore lint/correctness/noConstructorReturn: <explanation>
    return new Proxy(this, {
      get: (target, prop) => {
        // If the method is a function on the pipeline, wrap it with the executor logic
        if (typeof target.pipeline.pipeline[prop] === "function") {
          return (...args) => {
            return target.pipeline.withAutoPipeline((pipeline) => {
              pipeline[prop](...args);
            });
          };
        }
        // If it's not a function, just return it
        return target.pipeline[prop];
      },
    });
  }
}

export class PipelineAutoExecutor {
  private pipelinePromises = new WeakMap<Pipeline, Promise<Array<unknown>>>();
  private activePipeline: Pipeline | null = null;
  private indexInCurrentPipeline = 0;
  pipeline: Pipeline<[]>;

  constructor(pipeline: Pipeline<[]>) {
    this.pipeline = pipeline;
  }

  async withAutoPipeline<T>(executeWithPipeline: (pipeline: Pipeline) => unknown): Promise<T> {
    const pipeline = this.activePipeline || this.pipeline;

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
