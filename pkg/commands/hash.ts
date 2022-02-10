import { Command } from "../command"

/**
 * @see https://redis.io/commands/hdel
 */
export class HDelCommand extends Command<0 | 1> {
  constructor(key: string, field: string) {
    super(["hdel", key, field])
  }
}
/**
 * @see https://redis.io/commands/hexists
 */
export class HExistsCommand extends Command<number> {
  constructor(key: string, field: string) {
    super(["hexists", key, field])
  }
}

/**
 * @see https://redis.io/commands/hget
 */
export class HGetCommand<TValue> extends Command<TValue | null> {
  constructor(key: string, field: string) {
    super(["hget", key, field])
  }
}

/**
 * @see https://redis.io/commands/hgetall
 */
export class HGetAllCommand<TFields extends unknown[]> extends Command<TFields> {
  constructor(key: string) {
    super(["hgetall", key])
  }
}

/**
 * @see https://redis.io/commands/hincrby
 */
export class HIncrByCommand extends Command<number> {
  constructor(key: string, field: string, increment: number) {
    super(["hincrby", key, field, increment])
  }
}
/**
 * @see https://redis.io/commands/hincrbyfloat
 */
export class HIncrByFloatCommand extends Command<number> {
  constructor(key: string, field: string, increment: number) {
    super(["hincrbyfloat", key, field, increment])
  }
}

/**
 * @see https://redis.io/commands/hkeys
 */
export class HKeysCommand extends Command<string[]> {
  constructor(key: string) {
    super(["hkeys", key])
  }
}

/**
 * @see https://redis.io/commands/hlen
 */
export class HLenCommand extends Command<number> {
  constructor(key: string) {
    super(["hlen", key])
  }
}

/**
 * @see https://redis.io/commands/hmget
 */
export class HMGetCommand<TValues extends unknown[]> extends Command<TValues> {
  constructor(key: string, ...fields: string[]) {
    super(["hmget", key, ...fields])
  }
}

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand extends Command<number> {
  constructor(key: string, ...kv: { field: string; value: unknown }[]) {
    super(["hmset", key, ...kv.flatMap(({ field, value }) => [field, value])])
  }
}

/**
 * @see https://redis.io/commands/hscan
 */
export class HScanCommand extends Command<[number, string[]]> {
  constructor(pattern: string, cursor: number) {
    super(["hscan", pattern, cursor])
  }
}

/**
 * @see https://redis.io/commands/hset
 */
export class HSetCommand<TValue> extends Command<number> {
  constructor(key: string, field: string, value: TValue) {
    super(["hset", key, field, value])
  }
}

/**
 * @see https://redis.io/commands/hsetnx
 */
export class HSetNXCommand<TValue> extends Command<0 | 1> {
  constructor(key: string, field: string, value: TValue) {
    super(["hsetnx", key, field, value])
  }
}

/**
 * @see https://redis.io/commands/hstrlen
 */
export class HStrLenCommand extends Command<number> {
  constructor(key: string, field: string) {
    super(["hstrlen", key, field])
  }
}

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TValues extends unknown[]> extends Command<TValues> {
  constructor(key: string) {
    super(["hvals", key])
  }
}
