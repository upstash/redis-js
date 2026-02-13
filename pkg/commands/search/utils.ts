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
      if (pathParts.length == 1) {
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
        description["dataType"] = (rawResponse[i + 1] as string).toLowerCase() as
          | "hash"
          | "string"
          | "json";
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

export function deserializeAggregateResponse(rawResponse: any[], hasLimit: boolean): any {
  // Response is always wrapped: [[agg_key, agg_val, ...]] or [[agg_key, agg_val, ...], [search_results...]]
  if (
    hasLimit &&
    rawResponse.length === 2 &&
    Array.isArray(rawResponse[0]) &&
    Array.isArray(rawResponse[1])
  ) {
    const aggregationResult = parseAggregationArray(rawResponse[0] as any[]);
    const searchResults = deserializeQueryResponse(rawResponse[1] as any[]);
    return [aggregationResult, searchResults];
  }

  // Single aggregation result - unwrap the outer array
  if (Array.isArray(rawResponse) && rawResponse.length === 1 && Array.isArray(rawResponse[0])) {
    return parseAggregationArray(rawResponse[0] as any[]);
  }

  return rawResponse;
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
      result[key] = value;
    }
  }
  return result;
}

function parseBucketsValue(arr: any[]): any {
  // Format: ["buckets", [bucket1_array, bucket2_array, ...]]
  if (arr[0] === "buckets" && Array.isArray(arr[1])) {
    return {
      buckets: arr[1].map((bucket: any[]) => {
        const bucketObj: any = {};
        for (let i = 0; i < bucket.length; i += 2) {
          const key = bucket[i];
          const value = bucket[i + 1];
          bucketObj[key] =
            Array.isArray(value) && value.length > 0 && typeof value[0] === "string"
              ? parseStatsValue(value)
              : value;
        }
        return bucketObj;
      }),
    };
  }
  return arr;
}
