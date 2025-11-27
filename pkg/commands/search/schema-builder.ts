import type { NestedIndexSchema } from "./types";

// Internal symbol for build method
const BUILD = Symbol("build");

// Field builders with chainable options
class TextFieldBuilder<
  NoTokenize extends Record<"noTokenize", boolean> = { noTokenize: false },
  NoStem extends Record<"noStem", boolean> = { noStem: false },
> {
  private _noTokenize: NoTokenize;
  private _noStem: NoStem;

  constructor(
    noTokenize = { noTokenize: false } as NoTokenize,
    noStem = { noStem: false } as NoStem
  ) {
    this._noTokenize = noTokenize;
    this._noStem = noStem;
  }

  noTokenize(): TextFieldBuilder<{ noTokenize: true }, NoStem> {
    return new TextFieldBuilder({ noTokenize: true }, this._noStem);
  }

  noStem(): TextFieldBuilder<NoTokenize, { noStem: true }> {
    return new TextFieldBuilder(this._noTokenize, { noStem: true });
  }

  [BUILD](): NoTokenize extends { noTokenize: true }
    ? NoStem extends { noStem: true }
      ? { type: "TEXT"; noTokenize: true; noStem: true }
      : { type: "TEXT"; noTokenize: true }
    : NoStem extends { noStem: true }
      ? { type: "TEXT"; noStem: true }
      : "TEXT" {
    return this._noTokenize.noTokenize || this._noStem.noStem
      ? ({
          type: "TEXT",
          ...(this._noTokenize.noTokenize ? { noTokenize: true } : {}),
          ...(this._noStem.noStem ? { noStem: true } : {}),
        } as any)
      : ("TEXT" as any);
  }
}

class NumericFieldBuilder<
  T extends "U64" | "I64" | "F64",
  Fast extends Record<"fast", boolean> = { fast: false },
> {
  private _fast: Fast;
  private type: T;

  constructor(type: T, fast = { fast: false } as Fast) {
    this.type = type;
    this._fast = fast;
  }

  fast(): NumericFieldBuilder<T, { fast: true }> {
    return new NumericFieldBuilder(this.type, { fast: true });
  }

  [BUILD](): Fast extends { fast: true } ? { type: T; fast: true } : T {
    return this._fast.fast
      ? ({
          type: this.type,
          fast: true,
        } as any)
      : (this.type as any);
  }
}

class BoolFieldBuilder<Fast extends Record<"fast", boolean> = { fast: false }> {
  private _fast: Fast;

  constructor(fast = { fast: false } as Fast) {
    this._fast = fast;
  }

  fast(): BoolFieldBuilder<{ fast: true }> {
    return new BoolFieldBuilder({ fast: true });
  }

  [BUILD](): Fast extends { fast: true } ? { type: "BOOL"; fast: true } : "BOOL" {
    return this._fast.fast
      ? ({
          type: "BOOL",
          fast: true,
        } as any)
      : ("BOOL" as any);
  }
}

class DateFieldBuilder<Fast extends Record<"fast", boolean> = { fast: false }> {
  private _fast: Fast;

  constructor(fast = { fast: false } as Fast) {
    this._fast = fast;
  }

  fast(): DateFieldBuilder<{ fast: true }> {
    return new DateFieldBuilder({ fast: true });
  }

  [BUILD](): Fast extends { fast: true } ? { type: "DATE"; fast: true } : "DATE" {
    return this._fast.fast
      ? ({
          type: "DATE",
          fast: true,
        } as any)
      : ("DATE" as any);
  }
}

type FieldBuilder =
  | TextFieldBuilder<{ noTokenize: boolean }, { noStem: boolean }>
  | NumericFieldBuilder<"U64" | "I64" | "F64", { fast: boolean }>
  | BoolFieldBuilder<{ fast: boolean }>
  | DateFieldBuilder<{ fast: boolean }>;

// Schema builder
export const s = {
  /**
   * Full-text search field (TEXT)
   * @example
   * s.text() // Simple text field
   * s.text().noTokenize() // Exact phrase matching
   * s.text().noStem() // Disable stemming
   */
  text(): TextFieldBuilder {
    return new TextFieldBuilder();
  },

  /**
   * Unsigned 64-bit integer (U64)
   * Range: 0 to 2^64-1
   * @example
   * s.unsigned() // Simple unsigned field
   * s.unsigned().fast() // Enable sorting and range queries
   */
  unsignedInteger(): NumericFieldBuilder<"U64"> {
    return new NumericFieldBuilder("U64");
  },

  /**
   * Signed 64-bit integer (I64)
   * Range: -2^63 to 2^63-1
   * @example
   * s.integer() // Simple integer field
   * s.integer().fast() // Enable sorting and range queries
   */
  integer(): NumericFieldBuilder<"I64"> {
    return new NumericFieldBuilder("I64");
  },

  /**
   * 64-bit floating point (F64)
   * @example
   * s.float() // Simple float field
   * s.float().fast() // Enable sorting and range queries
   */
  float(): NumericFieldBuilder<"F64"> {
    return new NumericFieldBuilder("F64");
  },

  /**
   * Boolean field (BOOL)
   * @example
   * s.bool() // Simple boolean field
   * s.bool().fast() // Enable efficient filtering
   */
  bool(): BoolFieldBuilder {
    return new BoolFieldBuilder();
  },

  /**
   * ISO 8601 date field (DATE)
   * @example
   * s.date() // Simple date field
   * s.date().fast() // Enable sorting and range queries
   */
  date(): DateFieldBuilder {
    return new DateFieldBuilder();
  },

  /**
   * Create a string/JSON index schema (supports nesting)
   * @example
   * s.object({
   *   name: s.text(),
   *   profile: s.object({
   *     age: s.unsigned(),
   *     city: s.text()
   *   })
   * })
   */
  object<T extends Record<string, FieldBuilder | NestedIndexSchema>>(fields: T) {
    const result: any = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "object" && BUILD in value) {
        // It's a field builder
        result[key] = value[BUILD]();
      } else {
        // It's a nested object/schema
        result[key] = value;
      }
    }
    return result as {
      [K in keyof T]: T[K] extends FieldBuilder ? ReturnType<T[K][typeof BUILD]> : T[K];
    };
  },
};
