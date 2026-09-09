import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../../test-utils";
import { Pipeline } from "../../pipeline";
import { createVectorIndex, initVectorIndex, VectorIndex } from "./vector";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const created: VectorIndex[] = [];

afterAll(async () => {
  for (const index of created) {
    await index.drop();
  }
  await cleanup();
});

describe("VectorIndex", () => {
  test("createVectorIndex returns a usable handle", async () => {
    const name = newKey();
    const index = await createVectorIndex(client, { name, dimension: 3, metric: "COSINE" });
    created.push(index);

    expect(index).toBeInstanceOf(VectorIndex);
    expect(index.name).toBe(name);
    expect(await index.info()).toEqual({ dimension: 3, metric: "COSINE" });

    expect(await index.add("a", [1, 0, 0])).toBe(1);
    expect(await index.add("b", new Float32Array([0, 1, 0]))).toBe(1);
    expect(await index.add("a", [1, 0, 0])).toBe(0);
    expect(await index.count()).toBe(2);
    expect(await index.get("a")).toEqual([1, 0, 0]);
    expect(await index.get("missing")).toBeNull();

    const hits = await index.query({ vector: [1, 0, 0], topK: 1 });
    expect(hits).toEqual([{ id: "a", score: 1 }]);

    expect(await index.delete("a")).toBe(1);
    expect(await index.delete("a")).toBe(0);
    expect(await index.count()).toBe(1);
  });

  test("createVectorIndex with existsOk reuses an existing index", async () => {
    const name = newKey();
    const first = await createVectorIndex(client, { name, dimension: 2, metric: "DOT" });
    created.push(first);
    const second = await createVectorIndex(client, {
      name,
      dimension: 2,
      metric: "DOT",
      existsOk: true,
    });
    expect(second.name).toBe(name);
    expect(await second.info()).toEqual({ dimension: 2, metric: "DOT" });
  });

  test("initVectorIndex attaches to an existing index without a round trip", async () => {
    const name = newKey();
    created.push(await createVectorIndex(client, { name, dimension: 2, metric: "EUCLIDEAN" }));
    const index = initVectorIndex(client, name);
    expect(await index.add("p", [0, 0])).toBe(1);
    expect(await index.query({ vector: [0, 0], topK: 1 })).toEqual([{ id: "p", score: 1 }]);
  });

  test("drop removes the index", async () => {
    const name = newKey();
    const index = await createVectorIndex(client, { name, dimension: 1, metric: "COSINE" });
    expect(await index.drop()).toBe(1);
    expect(await index.info()).toBeNull();
    expect(await index.drop()).toBe(0);
  });
});

describe("pipeline.vector", () => {
  test("chains vector commands", async () => {
    const name = newKey();
    const p = new Pipeline({ client, multiExec: false });
    const res = await p.vector
      .create(name, { dimension: 2, metric: "DOT" })
      .vector.add(name, "a", [1, 1])
      .vector.info(name)
      .vector.count(name)
      .vector.get(name, "a")
      .vector.del(name, "a")
      .vector.drop(name)
      .exec();

    expect(res).toEqual([1, 1, { dimension: 2, metric: "DOT" }, 1, [1, 1], 1, 1]);
  });
});
