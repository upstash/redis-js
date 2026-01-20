import type { NestedIndexSchema, NumericField } from "./types";

type TextFieldBuild<
  TNoTokenize extends Record<"noTokenize", boolean>,
  TNoStem extends Record<"noStem", boolean>,
  TFrom extends Record<"from", string | null>,
> = TNoTokenize["noTokenize"] extends true
  ? { type: "TEXT"; noTokenize: true } & (TNoStem["noStem"] extends true
      ? { noStem: true }
      : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        {}) &
      (TFrom["from"] extends string
        ? { from: TFrom["from"] }
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {})
  : TNoStem["noStem"] extends true
    ? { type: "TEXT"; noStem: true } & (TFrom["from"] extends string
        ? { from: TFrom["from"] }
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {})
    : TFrom["from"] extends string
      ? { type: "TEXT"; from: TFrom["from"] }
      : "TEXT";

// Internal symbol for build method
const BUILD = Symbol("build");

// Field builders with chainable options
class TextFieldBuilder<
  TNoTokenize extends Record<"noTokenize", boolean> = { noTokenize: false },
  TNoStem extends Record<"noStem", boolean> = { noStem: false },
  TFrom extends Record<"from", string | null> = { from: null },
> {
  private _noTokenize: TNoTokenize;
  private _noStem: TNoStem;
  private _from: TFrom;

  constructor(
    noTokenize = { noTokenize: false } as TNoTokenize,
    noStem = { noStem: false } as TNoStem,
    from = { from: null } as TFrom
  ) {
    this._noTokenize = noTokenize;
    this._noStem = noStem;
    this._from = from;
  }

  noTokenize(): TextFieldBuilder<{ noTokenize: true }, TNoStem, TFrom> {
    return new TextFieldBuilder({ noTokenize: true }, this._noStem, this._from);
  }

  noStem(): TextFieldBuilder<TNoTokenize, { noStem: true }, TFrom> {
    return new TextFieldBuilder(this._noTokenize, { noStem: true }, this._from);
  }

  from<TField extends string>(
    field: TField
  ): TextFieldBuilder<TNoTokenize, TNoStem, { from: TField }> {
    return new TextFieldBuilder(this._noTokenize, this._noStem, { from: field } as {
      from: TField;
    });
  }

  [BUILD](): TextFieldBuild<TNoTokenize, TNoStem, TFrom> {
    const hasOptions =
      this._noTokenize.noTokenize || this._noStem.noStem || Boolean(this._from.from);

    return hasOptions
      ? ({
          type: "TEXT",
          ...(this._noTokenize.noTokenize ? { noTokenize: true } : {}),
          ...(this._noStem.noStem ? { noStem: true } : {}),
          ...(this._from.from ? { from: this._from.from } : {}),
        } as any)
      : ("TEXT" as any);
  }
}

class NumericFieldBuilder<T extends NumericField["type"]> {
  private type: T;

  constructor(type: T) {
    this.type = type;
  }

  [BUILD](): { type: T; fast: true } {
    return {
      type: this.type,
      fast: true,
    };
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
  | TextFieldBuilder<{ noTokenize: boolean }, { noStem: boolean }, { from: string | null }>
  | NumericFieldBuilder<NumericField["type"]>
  | BoolFieldBuilder<{ fast: boolean }>
  | DateFieldBuilder<{ fast: boolean }>;

export const s = {
  string(): TextFieldBuilder {
    return new TextFieldBuilder();
  },
  number<T extends NumericField["type"] = "F64">(type: T = "F64" as T): NumericFieldBuilder<T> {
    return new NumericFieldBuilder(type);
  },
  boolean(): BoolFieldBuilder {
    return new BoolFieldBuilder();
  },
  date(): DateFieldBuilder {
    return new DateFieldBuilder();
  },
  object<T extends ObjectFieldRecord<T>>(fields: T) {
    const result: any = {};
    for (const [key, value] of Object.entries(fields)) {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (value && typeof value === "object" && BUILD in value) {
        // It's a field builder
        result[key] = (value as any)[BUILD]();
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

type ObjectFieldRecord<T> = {
  [K in keyof T]: K extends string
    ? K extends `${infer _}.${infer _}`
      ? never
      : T[K] extends FieldBuilder | NestedIndexSchema
        ? T[K]
        : never
    : never;
};
