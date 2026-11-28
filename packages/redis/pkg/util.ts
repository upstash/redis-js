import type { ScanResultWithType } from "./commands/scan";

/**
 * JSON.parse that ignores one leading UTF-8 BOM (U+FEFF), as the base64 decoder
 * (TextDecoder) used to strip it before deserialization. Callers keep the exact
 * string (BOM included) when parsing fails.
 */
export function parseJSON(value: string): unknown {
  return JSON.parse(stripBOM(value) as string);
}

/**
 * Non-string values (e.g. integer replies) are returned unchanged.
 */
function stripBOM(value: unknown): unknown {
  return typeof value === "string" && value.startsWith("\uFEFF") ? value.slice(1) : value;
}

function parseRecursive(obj: unknown): unknown {
  const parsed = Array.isArray(obj)
    ? obj.map((o) => {
        try {
          return parseRecursive(o);
        } catch {
          return o;
        }
      })
    : parseJSON(obj as string);

  /**
   * Parsing very large numbers can result in MAX_SAFE_INTEGER
   * overflow. In that case we return the number as string instead.
   */
  if (typeof parsed === "number" && parsed.toString() !== stripBOM(obj)) {
    return obj;
  }
  return parsed;
}

export function parseResponse<TResult>(result: unknown): TResult {
  try {
    /**
     * Try to parse the response if possible
     */
    return parseRecursive(result) as TResult;
  } catch {
    return result as TResult;
  }
}

/**
 * Deserializes a scan result, excluding the cursor
 * which can be string "0" or a big number string.
 * Either way, we want it to stay as a string.
 *
 * @param result
 */
export function deserializeScanResponse<TResult>(result: [string, ...any]): TResult {
  return [result[0], ...parseResponse<any[]>(result.slice(1))] as TResult;
}

/**
 * Deserializes a sorted set score. Scores can come back with 17 significant digits
 * (e.g. "0.10000000000000001"), in exponent form (e.g. "1e+20") or as "inf" / "-inf",
 * which the default deserializer leaves as strings.
 */
export function deserializeScore(score: string | number): number {
  if (score === "inf") return Number.POSITIVE_INFINITY;
  if (score === "-inf") return Number.NEGATIVE_INFINITY;
  return Number(score);
}

/**
 * Deserializes a reply that alternates members and scores (WITHSCORES).
 * Members go through the default deserializer, scores through `deserializeScore`.
 */
export function deserializeWithScores(result: unknown[]): unknown[] {
  return result.map((value, index) =>
    index % 2 === 0 ? parseResponse(value) : deserializeScore(value as string)
  );
}

export function deserializeScanWithTypesResponse(result: [string, string[]]): ScanResultWithType {
  const [cursor, keys] = result;

  const parsedKeys: ScanResultWithType[1] = [];

  for (let i = 0; i < keys.length; i += 2) {
    parsedKeys.push({ key: keys[i], type: keys[i + 1] });
  }

  return [cursor, parsedKeys];
}

/**
 * Merges multiple Records of headers into a single Record
 * Later headers take precedence over earlier ones.
 *
 * @param headers - Array of header records to merge
 * @returns A new Record containing all merged headers
 *
 * @example
 * const defaultHeaders = { 'Content-Type': 'application/json' };
 * const customHeaders = { 'Authorization': 'Bearer token' };
 * const merged = mergeHeaders(defaultHeaders, customHeaders);
 */
export function mergeHeaders(
  ...headers: (Record<string, string> | undefined)[]
): Record<string, string> {
  const merged: Record<string, string> = {};

  for (const header of headers) {
    if (!header) continue;

    for (const [key, value] of Object.entries(header)) {
      if (value !== undefined && value !== null) {
        merged[key] = value;
      }
    }
  }

  return merged;
}

/**
 * Sets `key` on `obj` as an own property.
 *
 * `__proto__` is the only name a plain assignment doesn't store as an own
 * property, so only that one takes the slower `defineProperty` path.
 */
export function setOwnProperty<T>(obj: Record<string, T>, key: string, value: T): void {
  if (key === "__proto__") {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  } else {
    obj[key] = value;
  }
}

/**
 * Converts a kv-array `[k1, v1, k2, v2, ...]` into a Record of { k1: v1, k2: v2, ...}.
 */
export function kvArrayToObject<T extends Record<string, unknown>>(v: unknown): T {
  if (typeof v === "object" && v !== null && !Array.isArray(v)) return v as T;
  if (!Array.isArray(v)) return {} as T;
  const obj: T = {} as T;
  for (let i = 0; i < v.length; i += 2) {
    if (typeof v[i] === "string") setOwnProperty(obj as Record<string, unknown>, v[i], v[i + 1]);
  }
  return obj;
}
