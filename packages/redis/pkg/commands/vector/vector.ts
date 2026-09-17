import type { Requester } from "../../http";
import type { CommandOptions } from "../command";
import { VectorAddCommand } from "../vector_add";
import { VectorCountCommand } from "../vector_count";
import { VectorCreateCommand } from "../vector_create";
import { VectorDelCommand } from "../vector_del";
import { VectorDropCommand } from "../vector_drop";
import { VectorGetCommand } from "../vector_get";
import { VectorInfoCommand } from "../vector_info";
import { VectorQueryCommand } from "../vector_query";
import type {
  VectorCreateOptions,
  VectorIndexInfo,
  VectorInput,
  VectorQueryOptions,
  VectorQueryResult,
} from "./types";

export type CreateVectorIndexParameters = VectorCreateOptions & {
  /**
   * Name (key) of the index.
   */
  name: string;
};

export type VectorIndexParameters = {
  name: string;
  client: Requester;
  commandOptions?: CommandOptions<any, any>;
};

/**
 * A handle to a vector index. Obtain one with `redis.vector.createIndex(...)` or
 * `redis.vector.index(name)`.
 *
 * @example
 * ```typescript
 * const index = await redis.vector.createIndex({ name: "docs", dimension: 3, metric: "COSINE" });
 * await index.add("doc-1", [0.1, 0.2, 0.3]);
 * const hits = await index.query({ vector: [0.1, 0.2, 0.3], topK: 5 });
 * ```
 */
export class VectorIndex {
  readonly name: string;
  private client: Requester;
  private commandOptions?: CommandOptions<any, any>;

  constructor({ name, client, commandOptions }: VectorIndexParameters) {
    this.name = name;
    this.client = client;
    this.commandOptions = commandOptions;
  }

  /**
   * Adds a vector to the index, or overwrites the vector stored under `id`.
   *
   * @returns `1` if a new vector was inserted, `0` if an existing one was overwritten.
   */
  add(id: string, vector: VectorInput): Promise<0 | 1> {
    return new VectorAddCommand([this.name, id, vector], this.commandOptions).exec(this.client);
  }

  /**
   * Returns the vector stored under `id`, or `null` if it does not exist.
   */
  get(id: string): Promise<number[] | null> {
    return new VectorGetCommand([this.name, id], this.commandOptions).exec(this.client);
  }

  /**
   * Returns the `topK` nearest neighbours of the query vector.
   */
  query(options: VectorQueryOptions): Promise<VectorQueryResult[]> {
    return new VectorQueryCommand([this.name, options], this.commandOptions).exec(this.client);
  }

  /**
   * Deletes the vector stored under `id`.
   *
   * @returns `1` if the vector existed and was removed, `0` otherwise.
   */
  delete(id: string): Promise<0 | 1> {
    return new VectorDelCommand([this.name, id], this.commandOptions).exec(this.client);
  }

  /**
   * Returns the number of vectors in the index.
   */
  count(): Promise<number> {
    return new VectorCountCommand([this.name], this.commandOptions).exec(this.client);
  }

  /**
   * Returns the dimension and metric of the index, or `null` if it does not exist.
   */
  info(): Promise<VectorIndexInfo | null> {
    return new VectorInfoCommand([this.name], this.commandOptions).exec(this.client);
  }

  /**
   * Drops the index and all vectors in it.
   *
   * @returns `1` if the index existed and was dropped, `0` otherwise.
   */
  drop(): Promise<0 | 1> {
    return new VectorDropCommand([this.name], this.commandOptions).exec(this.client);
  }
}

/**
 * Creates a vector index and returns a handle to it.
 */
export async function createVectorIndex(
  client: Requester,
  { name, ...opts }: CreateVectorIndexParameters,
  commandOptions?: CommandOptions<any, any>
): Promise<VectorIndex> {
  await new VectorCreateCommand([name, opts], commandOptions).exec(client);
  return new VectorIndex({ name, client, commandOptions });
}

/**
 * Returns a handle to an existing vector index without sending any command.
 */
export function initVectorIndex(
  client: Requester,
  name: string,
  commandOptions?: CommandOptions<any, any>
): VectorIndex {
  return new VectorIndex({ name, client, commandOptions });
}
