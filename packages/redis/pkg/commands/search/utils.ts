import type {
  DescribeFieldInfo,
  DetailedField,
  FlatIndexSchema,
  IndexDescription,
  Language,
  QueryOptions,
  QueryResult,
} from "./types";
import { FIELD_TYPES, type FieldType, type NestedIndexSchema } from "./types";

type FlattenedField = {
  path: string;
  type: FieldType;
  fast?: boolean;
  noTokenize?: boolean;
  noStem?: boolean;
  from?: string;
};

function isFieldType(value: any): value is FieldType {
  return typeof value === "string" && (FIELD_TYPES as readonly string[]).includes(value);
}

function isDetailedField(value: any): value is DetailedField {
  return typeof value === "object" && value !== null && "type" in value && isFieldType(value.type);
}

function isNestedSchema(value: any): value is NestedIndexSchema {
  return typeof value === "object" && value !== null && !isDetailedField(value);
}

export function flattenSchema(
  schema: NestedIndexSchema | FlatIndexSchema,
  pathPrefix: string[] = []
): FlattenedField[] {
  const fields: FlattenedField[] = [];

  for (const [key, value] of Object.entries(schema)) {
    const currentPath = [...pathPrefix, key];
    const pathString = currentPath.join(".");

    if (isFieldType(value)) {
      fields.push({
        path: pathString,
        type: value,
      });
    } else if (isDetailedField(value)) {
      fields.push({
        path: pathString,
        type: value.type as FieldType,
        fast: "fast" in value ? value.fast : undefined,
        noTokenize: "noTokenize" in value ? value.noTokenize : undefined,
        noStem: "noStem" in value ? value.noStem : undefined,
        from: "from" in value ? value.from : undefined,
      });
    } else if (isNestedSchema(value)) {
      const nestedFields = flattenSchema(value, currentPath);
      fields.push(...nestedFields);
    }
  }

  return fields;
}

export function deserializeQueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema = any,
  TOptions extends QueryOptions<TSchema> | undefined = any,
>(rawResponse: unknown[]): QueryResult<TSchema, TOptions>[] {
  return rawResponse.map((itemRaw) => {
    const raw = itemRaw as [string, string, unknown[]?];
    const key = raw[0];
    const score = Number(raw[1]);
    const rawFields = raw[2];

    if (rawFields === undefined) {
      return { key, score } as QueryResult<TSchema, TOptions>;
    }

    if (!Array.isArray(rawFields) || rawFields.length === 0) {
      return { key, score, data: {} } as QueryResult<TSchema, TOptions>;
    }

    // Merge all field objects into a single object
    let data: Record<string, unknown> = {};

    for (const fieldRaw of rawFields as [string, unknown][]) {
      const key = fieldRaw[0];
      const value = fieldRaw[1];

      const pathParts = key.split(".");
      if (pathParts.length === 1) {
        data[key] = value;
      } else {
        let currentObj = data;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const pathPart = pathParts[i];
          if (!(pathPart in currentObj)) {
            currentObj[pathPart] = {};
          }

          currentObj = currentObj[pathPart] as Record<string, unknown>;
        }

        currentObj[pathParts.at(-1)!] = value;
      }
    }

    // If $ key exists (full document), use its contents directly
    if ("$" in data) {
      data = data["$"] as Record<string, unknown>;
    }

    return { key, score, data } as QueryResult<TSchema, TOptions>;
  });
}

export function deserializeDescribeResponse<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  rawResponse: unknown[]
): IndexDescription<TSchema> {
  const description = {} as IndexDescription<TSchema>;

  for (let i = 0; i < rawResponse.length; i += 2) {
    const descriptor = rawResponse[i] as string;
    switch (descriptor) {
      case "name": {
        description["name"] = rawResponse[i + 1] as string;
        break;
      }
      case "type": {
        description["dataType"] = (
          rawResponse[i + 1] as string
        ).toLowerCase() as IndexDescription<TSchema>["dataType"];
        break;
      }
      case "prefixes": {
        description["prefixes"] = rawResponse[i + 1] as string[];
        break;
      }
      case "language": {
        description["language"] = rawResponse[i + 1] as Language;
        break;
      }
      case "schema": {
        const schema: Record<string, DescribeFieldInfo> = {};
        for (const fieldDescription of rawResponse[i + 1] as string[][]) {
          const fieldName = fieldDescription[0];
          const fieldInfo: DescribeFieldInfo = { type: fieldDescription[1] as FieldType };

          if (fieldDescription.length > 2) {
            for (let j = 2; j < fieldDescription.length; j++) {
              const fieldOption = fieldDescription[j];
              switch (fieldOption) {
                case "NOSTEM": {
                  fieldInfo.noStem = true;
                  break;
                }
                case "NOTOKENIZE": {
                  fieldInfo.noTokenize = true;
                  break;
                }
                case "FAST": {
                  fieldInfo.fast = true;
                  break;
                }
                case "FROM": {
                  fieldInfo.from = fieldDescription[++j];
                  break;
                }
              }
            }
          }

          schema[fieldName] = fieldInfo;
        }
        description["schema"] = schema;
        break;
      }
    }
  }

  return description;
}

export function parseCountResponse(rawResponse: any): number {
  return typeof rawResponse === "number" ? rawResponse : Number.parseInt(rawResponse, 10);
}

export function deserializeAggregateResponse(
  rawResponse: any[],
  aggregations?: Record<string, any>
): any {
  // Response is a flat key-value array: [key, val, key, val, ...]
  const result = parseAggregationArray(rawResponse);
  if (aggregations) restoreEmptyKeyedBuckets(result, aggregations);
  return result;
}

/** The server sends empty `keyed: true` buckets as a list, so turn them into an object. */
function restoreEmptyKeyedBuckets(result: any, aggregations: Record<string, any>): void {
  for (const [name, aggregation] of Object.entries(aggregations)) {
    const value = result?.[name];
    if (!value || !aggregation) continue;
    const operator = Object.keys(aggregation).find((key) => key !== "$aggs");
    const keyed = operator ? aggregation[operator]?.keyed === true : false;
    if (keyed && Array.isArray(value.buckets) && value.buckets.length === 0) {
      value.buckets = {};
    }
    if (aggregation.$aggs && value.buckets && typeof value.buckets === "object") {
      for (const bucket of Object.values(value.buckets)) {
        restoreEmptyKeyedBuckets(bucket, aggregation.$aggs);
      }
    }
  }
}

function parseAggregationArray(arr: any[]): any {
  const result: any = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];

    if (Array.isArray(value)) {
      // Check if it's a stats-like array or buckets array
      if (value.length > 0 && typeof value[0] === "string") {
        // Stats or buckets format
        result[key] = value[0] === "buckets" ? parseBucketsValue(value) : parseStatsValue(value);
      } else {
        // Nested aggregation
        result[key] = parseAggregationArray(value);
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

function coerceNumericString(value: any): any {
  if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}

function parseStatsValue(arr: any[]): any {
  const result: any = {};
  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];

    if (Array.isArray(value) && value.length > 0) {
      // Check if it's a single array following key-value format
      if (typeof value[0] === "string") {
        result[key] = parseStatsValue(value);
      }
      // Check if it's an array of arrays (like percentiles unkeyed format)
      else if (Array.isArray(value[0]) && typeof value[0][0] === "string") {
        result[key] = value.map((item: any[]) => parseStatsValue(item));
      }
      // Otherwise keep as-is
      else {
        result[key] = value;
      }
    } else {
      result[key] = coerceNumericString(value);
    }
  }
  return result;
}

function parseBucketsValue(arr: any[]): any {
  // Format: ["buckets", [bucket1_array, bucket2_array, ...], extraKey, extraVal, ...]
  // With `keyed: true`: ["buckets", [key1, bucket1_array, key2, bucket2_array, ...], ...]
  if (arr[0] === "buckets" && Array.isArray(arr[1])) {
    const rawBuckets: any[] = arr[1];
    const keyed = rawBuckets.length > 0 && !Array.isArray(rawBuckets[0]);
    let buckets: any;
    if (keyed) {
      buckets = {};
      for (let i = 0; i < rawBuckets.length; i += 2) {
        buckets[rawBuckets[i]] = parseBucket(rawBuckets[i + 1]);
      }
    } else {
      buckets = rawBuckets.map((bucket: any[]) => parseBucket(bucket));
    }
    const result: any = { buckets };
    // Parse remaining key-value pairs (e.g. sumOtherDocCount, docCountErrorUpperBound, afterKey)
    for (let i = 2; i < arr.length; i += 2) {
      // `afterKey` of $composite is a list of source names and cursor values
      result[arr[i]] = arr[i] === "afterKey" ? parsePairs(arr[i + 1]) : arr[i + 1];
    }
    return result;
  }
  return arr;
}

function parseBucket(bucket: any[]): any {
  const bucketObj: any = {};
  for (let i = 0; i < bucket.length; i += 2) {
    const key = bucket[i];
    const value = bucket[i + 1];
    if (key === "key" && Array.isArray(value)) {
      // The key of a $composite bucket maps source names to values
      bucketObj[key] = parsePairs(value);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      // A sub-aggregation
      bucketObj[key] = value[0] === "buckets" ? parseBucketsValue(value) : parseStatsValue(value);
    } else {
      bucketObj[key] = value;
    }
  }
  return bucketObj;
}

/** Turns `[name, value, name, value, ...]` into an object, keeping the values as they are. */
function parsePairs(arr: any[]): any {
  const result: any = {};
  for (let i = 0; i < arr.length; i += 2) {
    result[arr[i]] = arr[i + 1];
  }
  return result;
}
