/**
 * Distance metric used by a vector index.
 */
export type VectorMetric = "COSINE" | "EUCLIDEAN" | "DOT";

/**
 * Speed / recall trade-off for `VECTOR.QUERY`.
 *
 * @default "BALANCED"
 */
export type VectorQueryProfile = "FAST" | "BALANCED" | "PRECISE";

/**
 * A vector to add or query with. Accepts:
 * - `number[]`: sent as `VALUES <n> <f1> ... <fn>`
 * - `Float32Array`: encoded as little-endian FP32 and sent as `BASE64-FP32 <b64>`
 * - `{ base64: string }`: a base64-encoded little-endian FP32 blob, sent as-is with `BASE64-FP32`
 *   (e.g. the `encoding_format: "base64"` output of embedding providers)
 */
export type VectorInput = number[] | Float32Array | { base64: string };

export type VectorCreateOptions = {
  /**
   * Number of dimensions of the vectors stored in the index. Must be between 1 and 32768.
   */
  dimension: number;
  /**
   * Distance metric used to compare vectors.
   */
  metric: VectorMetric;
  /**
   * When `true`, creating an index that already exists with the same dimension and metric
   * succeeds (returns `0`) instead of throwing.
   */
  existsOk?: boolean;
};

export type VectorQueryOptions = {
  /**
   * The query vector.
   */
  vector: VectorInput;
  /**
   * Number of nearest neighbours to return. Must be between 1 and 1000.
   */
  topK: number;
  /**
   * Speed / recall trade-off.
   *
   * @default "BALANCED"
   */
  profile?: VectorQueryProfile;
};

export type VectorQueryResult = {
  id: string;
  score: number;
};

export type VectorIndexInfo = {
  dimension: number;
  metric: VectorMetric;
};
