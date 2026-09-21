import type { VectorIndexInfo, VectorInput, VectorMetric, VectorQueryResult } from "./types";

/**
 * Encodes a Float32Array as a base64 string of its little-endian FP32 bytes.
 */
export function float32ToBase64(vector: Float32Array): string {
  const bytes = new Uint8Array(vector.length * 4);
  const view = new DataView(bytes.buffer);
  for (const [i, value] of vector.entries()) {
    view.setFloat32(i * 4, value, true);
  }

  let binary = "";
  const chunkSize = 0x80_00;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCodePoint(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Converts a {@link VectorInput} into the trailing arguments of `VECTOR.ADD` / `VECTOR.QUERY`.
 */
export function serializeVector(vector: VectorInput): (string | number)[] {
  if (Array.isArray(vector)) {
    return ["VALUES", vector.length, ...vector];
  }
  if (vector instanceof Float32Array) {
    return ["BASE64-FP32", float32ToBase64(vector)];
  }
  return ["BASE64-FP32", vector.base64];
}

export function deserializeVectorValues(result: (string | number)[] | null): number[] | null {
  if (result === null) {
    return null;
  }
  return result.map(Number);
}

export function deserializeVectorQueryResponse(
  result: [string, string | number][]
): VectorQueryResult[] {
  return result.map(([id, score]) => ({ id: String(id), score: Number(score) }));
}

export function deserializeVectorInfoResponse(
  result: (string | number)[] | Record<string, string | number> | null
): VectorIndexInfo | null {
  if (result === null) {
    return null;
  }

  const fields: Record<string, string | number> = Array.isArray(result)
    ? Object.fromEntries(
        Array.from({ length: Math.floor(result.length / 2) }, (_, i) => [
          String(result[i * 2]),
          result[i * 2 + 1],
        ])
      )
    : result;

  return {
    dimension: Number(fields.dimension),
    metric: String(fields.metric).toUpperCase() as VectorMetric,
  };
}
