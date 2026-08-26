import { describe, expect, test } from "bun:test";
import {
  deserializeVectorInfoResponse,
  deserializeVectorQueryResponse,
  deserializeVectorValues,
  float32ToBase64,
  serializeVector,
} from "./utils";

describe("float32ToBase64", () => {
  test("encodes little-endian FP32", () => {
    expect(float32ToBase64(new Float32Array([1, 0, 0]))).toBe("AACAPwAAAAAAAAAA");
    expect(float32ToBase64(new Float32Array([-1.5]))).toBe("AADAvw==");
  });

  test("round-trips through a DataView", () => {
    const input = new Float32Array([0.1, -2.5, 1e-7, 12_345.678]);
    const bytes = Uint8Array.from(atob(float32ToBase64(input)), (c) => c.codePointAt(0)!);
    const view = new DataView(bytes.buffer);
    for (const [i, value] of input.entries()) {
      expect(view.getFloat32(i * 4, true)).toBe(value);
    }
  });

  test("handles vectors larger than the chunk size", () => {
    const input = new Float32Array(20_000).fill(1);
    const encoded = float32ToBase64(input);
    expect(atob(encoded).length).toBe(80_000);
  });
});

describe("serializeVector", () => {
  test("number[] becomes VALUES", () => {
    expect(serializeVector([1, 2.5, -3])).toEqual(["VALUES", 3, 1, 2.5, -3]);
  });

  test("Float32Array becomes BASE64-FP32", () => {
    expect(serializeVector(new Float32Array([1, 0, 0]))).toEqual([
      "BASE64-FP32",
      "AACAPwAAAAAAAAAA",
    ]);
  });

  test("base64 input is passed through", () => {
    expect(serializeVector({ base64: "AACAPw==" })).toEqual(["BASE64-FP32", "AACAPw=="]);
  });
});

describe("deserializers", () => {
  test("values are converted to numbers", () => {
    expect(deserializeVectorValues(["1", "0.5", 2])).toEqual([1, 0.5, 2]);
    expect(deserializeVectorValues(null)).toBeNull();
  });

  test("query results keep ids as strings", () => {
    expect(
      deserializeVectorQueryResponse([
        ["123", "0.5"],
        ["abc", 1],
      ])
    ).toEqual([
      { id: "123", score: 0.5 },
      { id: "abc", score: 1 },
    ]);
  });

  test("info handles flat arrays, objects and null", () => {
    expect(deserializeVectorInfoResponse(["dimension", 3, "metric", "COSINE"])).toEqual({
      dimension: 3,
      metric: "COSINE",
    });
    expect(deserializeVectorInfoResponse({ dimension: "4", metric: "dot" })).toEqual({
      dimension: 4,
      metric: "DOT",
    });
    expect(deserializeVectorInfoResponse(null)).toBeNull();
  });
});
