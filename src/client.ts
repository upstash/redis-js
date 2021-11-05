import fetch from 'isomorphic-unfetch';
import {
  ClientObjectProps,
  ReturnType,
  Callback,
  Part,
  Upstash,
  Bit,
  ZSetNumber,
  EdgeCacheType,
} from './type';

function parseOptions(
  url?: string | ClientObjectProps,
  token?: string,
  edgeUrl?: string | null,
  readFromEdge?: boolean
): ClientObjectProps {
  if (typeof url === 'object')
    return parseOptions(url.url, url.token, url.edgeUrl, url.readFromEdge);
  // Try to auto fill from env variables
  if (!url) url = process.env.UPSTASH_REDIS_REST_URL;
  if (!token) token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (edgeUrl === undefined) edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;
  readFromEdge = readFromEdge ?? !!edgeUrl;

  if (readFromEdge && !edgeUrl) {
    throw new Error(`readFromEdge is set to true but the Edge Url is missing`);
  }
  if (!url) throw new Error('REST Url is missing');
  if (!token) throw new Error('REST token is missing');

  return { url, token, edgeUrl, readFromEdge };
}

async function fetchData(
  url: string,
  options: ClientObjectProps,
  init: RequestInit
): Promise<ReturnType> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        authorization: `Bearer ${options.token}`,
        ...init.headers,
      },
    });

    // Is there a case where we might want to handle a non-json response?
    if (!res.headers.get('Content-Type')!.includes('application/json')) {
      throw new Error('Successful response from Upstash is not JSON');
    }

    const data = await res.json();

    if (res.ok) {
      let edge = false;
      let cache: EdgeCacheType = null;

      switch (res.headers.get('x-cache')) {
        case 'Hit from cloudfront':
          edge = true;
          cache = 'hit';
          break;
        case 'Miss from cloudfront':
          edge = true;
          cache = 'miss';
          break;
      }

      return {
        data: data.result,
        error: null,
        metadata: { edge, cache },
      };
    } else {
      if (data.error) throw data;
      throw new Error(
        `Upstash failed with (${res.status}): ${JSON.stringify(data, null, 2)}`
      );
    }
  } catch (err: any) {
    return {
      data: null,
      error: typeof err.data === 'object' ? err.data.message : err,
      metadata: { edge: false, cache: null },
    };
  }
}

function request(
  config: { options: ClientObjectProps; edge?: boolean },
  args: Part[]
) {
  const { options, edge } = config;
  const fromEdge =
    edge === false ? false : !!options.edgeUrl && options.readFromEdge;

  if (!options.edgeUrl && edge) {
    throw new Error(`"edge: true" is being used but the Edge Url is missing`);
  }

  if (fromEdge) {
    const command = encodeURI(args.join('/'));
    const edgeUrlWithPath = `${options.edgeUrl}/${command}`;
    return fetchData(edgeUrlWithPath, options, { method: 'GET' });
  } else {
    return fetchData(options.url, options, {
      method: 'POST',
      body: JSON.stringify(args),
    });
  }
}

type CustomArgsFn = (...args: any[]) => any[];

type StaticArgs = number | boolean | 'spread';

type PossibleArgs =
  | number
  | [number, ...(StaticArgs | CustomArgsFn)[]]
  | ((options: ClientObjectProps, ...args: any[]) => any);

/**
 * Creates a Upstash Redis instance
 *
 * @constructor
 * @param {string} url - database rest url
 * @param {string} token - database rest token
 * @param {Object} options - database config
 * @param {string} [options.url] - database rest url
 * @param {string} [options.token] - database rest token
 * @param {string} [options.edgeUrl] - database rest edge url
 * @param {string} [options.readFromEdge] - database rest read from edge
 *
 * @example
 * ```js
 * import Upstash from '@upstash/redis'
 *
 * const redis1 = new Upstash('url', token);
 * const redis2 = new Upstash({ url: '', token: '', edgeUrl: '', readFromEdge: false });
 * ```
 */
function upstash(options?: ClientObjectProps): Upstash;
function upstash(url: string, token: string): Upstash;
function upstash(url?: string | ClientObjectProps, token?: string): Upstash {
  const options = parseOptions(url, token);

  let x = new Proxy(operations, {
    get(target, prop: keyof typeof operations) {
      let argsCount = target[prop] as PossibleArgs;
      if (argsCount === undefined) return;

      return (...args: any[]) => {
        // Passthrough
        if (typeof argsCount === 'function') {
          return argsCount(options, ...args);
        }
        if (!Array.isArray(argsCount)) {
          argsCount = [argsCount];
        }

        const opArgs: any[] = [];
        const knownArgsCount = argsCount[0];
        let nextArg = 0;
        let edge;

        for (const arg of argsCount.slice(1)) {
          if (typeof arg === 'number') {
            opArgs.push(...args.slice(nextArg, nextArg + arg));
            nextArg += arg;
            continue;
          }
          if (typeof arg === 'boolean') {
            edge = arg;
            continue;
          }
          if (arg === 'spread') {
            opArgs.push(...args[nextArg]);
          } else if (typeof arg === 'function') {
            opArgs.push(...arg(...args));
          }
          // Make sure to increase nextArg if the arg is a spread or
          // a function so we don't push the same arguments twice
          nextArg++;
          // There can only be one spread or function defined
          break;
        }
        // Handle cases like `1`, `[1, false]`
        if (!nextArg && knownArgsCount) {
          opArgs.push(...args.slice(0, knownArgsCount));
        }

        // Start looking for config and callback in the next args.
        // In the case of `get` for example, `knownArgsCount` is 1, so
        // the `key` arg will be the first argument (0), and the
        // config and callback would start from 1.
        let configOrCb: { edge?: boolean } | Callback = args[knownArgsCount];
        let cb: Callback = args[knownArgsCount + 1] ?? ((res) => res);

        if (typeof configOrCb === 'function') {
          cb = configOrCb;
          configOrCb = {};
        }
        // Should avoid edge cases with string
        else if (typeof configOrCb !== 'object') configOrCb = {};

        // Add the name of the operation as the first argument
        opArgs.unshift(prop);

        return request({ options, edge, ...configOrCb }, opArgs).then(cb);
      };
    },
  });

  // The type conversion below is required, because our Proxy is a trap
  // and its target object is being used in a completely different way
  return x as unknown as Upstash;
}

const operations = {
  /**
   * Auth
   */
  auth(
    options: ClientObjectProps,
    url?: string | ClientObjectProps,
    token?: string
  ) {
    Object.assign(options, parseOptions(url, token));
  },
  /**
   * STRING
   */
  append: [2, false],
  decr: [1, false],
  decrby: [2, false],
  get: 1,
  getrange: 3,
  getset: [2, false],
  incr: [1, false],
  incrby: [2, false],
  incrbyfloat: [2, false],
  mget: [1, 'spread'],
  mset: [1, false, 'spread'],
  msetnx: [1, false, 'spread'],
  psetex: [3, false],
  set: [2, false],
  setex: [3, false],
  setnx: [2, false],
  setrange: [3, false],
  strlen: 1,
  /**
   * BITMAPS
   */
  bitcount: [
    3,
    1,
    (key: string, start?: number, end?: number) =>
      start !== undefined && end !== undefined ? [start, end] : [],
  ],
  bitop: [3, 2, 'spread'],
  bitpos: [
    4,
    2,
    (key: string, bit: Bit, start?: number, end?: number) => {
      const args = [];
      if (start !== undefined) args.push(start);
      if (end !== undefined) args.push(end);
      return args;
    },
  ],
  getbit: 2,
  setbit: [3, false],
  /**
   * CONNECTION
   */
  echo: 1,
  ping: [1, (value?: string) => (value ? [value] : [])],
  hdel: [2, false, 1, 'spread'],
  hexists: 2,
  hget: 2,
  hgetall: 1,
  hincrby: [3, false],
  hincrbyfloat: [3, false],
  hkeys: 1,
  hlen: 1,
  hmget: [2, 1, 'spread'],
  hmset: [2, false, 1, 'spread'],
  hscan: [
    3,
    false,
    2,
    (
      key: string,
      cursor: number,
      options?: { match?: number | string; count?: number | string }
    ) => {
      const args = [];
      if (options?.match) args.push('match', options.match);
      if (options?.count) args.push('count', options.count);
      return args;
    },
  ],
  hset: [2, false, 1, 'spread'],
  hsetnx: [3, false],
  hvals: 1,
  /**
   * KEYS
   */
  del: [1, false, 'spread'],
  exists: [1, 'spread'],
  expire: [2, false],
  expireat: [2, false],
  keys: 1,
  persist: [1, false],
  pexpire: [2, false],
  pexpireat: [2, false],
  pttl: 1,
  randomkey: [0, false],
  rename: [2, false],
  renamenx: [2, false],
  scan: [
    2,
    false,
    1,
    (
      cursor: number,
      options?: { match?: number | string; count?: number | string }
    ) => {
      const args = [];
      if (options?.match) args.push('match', options.match);
      if (options?.count) args.push('count', options.count);
      return args;
    },
  ],
  touch: [1, false, 'spread'],
  ttl: 1,
  type: 1,
  unlink: [1, false, 'spread'],
  /**
   * LISTS
   */
  lindex: 2,
  linsert: [4, false],
  llen: 1,
  lpop: [1, false],
  lpush: [2, false, 1, 'spread'],
  lpushx: [2, false, 1, 'spread'],
  lrange: 3,
  lrem: [3, false],
  lset: [3, false],
  ltrim: [3, false],
  rpop: [1, false],
  rpoplpush: [2, false],
  rpush: [2, false, 1, 'spread'],
  rpushx: [2, false, 1, 'spread'],
  /**
   * SERVER
   */
  dbsize: 0,
  flushall: [1, false, (mode?: 'ASYNC') => (mode ? [mode] : [])],
  flushdb: [1, false, (mode?: 'ASYNC') => (mode ? [mode] : [])],
  info: 0,
  time: [0, false],
  /**
   * SET
   */
  sadd: [2, false, 1, 'spread'],
  scard: 1,
  sdiff: [1, 'spread'],
  sdiffstore: [2, false, 1, 'spread'],
  sinter: [1, 'spread'],
  sinterstore: [2, false, 1, 'spread'],
  sismember: 2,
  smembers: 1,
  smove: [3, false],
  spop: [2, false, 1, (key: string, count?: number) => (count ? [count] : [])],
  srandmember: [2, 1, (key: string, count?: number) => (count ? [count] : [])],
  srem: [2, false, 1, 'spread'],
  sunion: [1, 'spread'],
  sunionstore: [2, false, 1, 'spread'],
  /**
   * SORTED SETS
   */
  zadd: [
    3,
    1,
    (
      key: string,
      values: ZSetNumber[],
      options?: ({ xx?: boolean } | { nx?: boolean }) & {
        ch?: boolean;
        incr: boolean;
      }
    ) => {
      if (options) {
        const allOptions = Object.entries(options)
          .filter((e) => ['string', 'number', 'boolean'].includes(typeof e[1]))
          .map((e) => e[0].toUpperCase());

        return [...allOptions, ...values];
      }
      return values;
    },
  ],
  zcard: 1,
  zcount: 3,
  zincrby: [3, false],
  zinterstore: [
    3,
    1,
    (
      destination: string,
      keys: string[],
      options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
    ) => {
      const args = [keys.length, ...keys];
      if (options?.weights) args.push('weights', ...options.weights);
      if (options?.aggregate) args.push('aggregate', options.aggregate);
      return args;
    },
  ],
  zlexcount: 3,
  zpopmax: [
    2,
    false,
    1,
    (key: string, count?: number) => (count ? [count] : []),
  ],
  zpopmin: [
    2,
    false,
    1,
    (key: string, count?: number) => (count ? [count] : []),
  ],
  zrange: [
    4,
    3,
    (
      key: string,
      min: ZSetNumber,
      max: ZSetNumber,
      options?: { withScores: boolean }
    ) => (options?.withScores ? ['WITHSCORES'] : []),
  ],
  zrangebylex: [
    5,
    3,
    (
      key: string,
      min: ZSetNumber,
      max: ZSetNumber,
      offset?: number,
      count?: number
    ) => (offset && count ? ['LIMIT', offset, count] : []),
  ],
  zrangebyscore: [
    4,
    3,
    (
      key: string,
      min: ZSetNumber,
      max: ZSetNumber,
      options?: {
        withScores?: boolean;
        limit?: { offset: number; count: number };
      }
    ) => {
      const args = [];
      if (options?.withScores) args.push('WITHSCORES');
      if (options?.limit)
        args.push('LIMIT', options.limit.offset, options.limit.count);
      return args;
    },
  ],
  zrank: 2,
  zrem: [2, false, 1, 'spread'],
  zremrangebylex: [3, false],
  zremrangebyrank: [3, false],
  zremrangebyscore: [3, false],
  zrevrange: [
    4,
    3,
    (
      key: string,
      start: number,
      stop: number,
      options?: { withScores: boolean }
    ) => (options?.withScores ? ['WITHSCORES'] : []),
  ],
  zrevrangebylex: [
    5,
    3,
    (
      key: string,
      max: ZSetNumber,
      min: ZSetNumber,
      offset?: number,
      count?: number
    ) => (offset && count ? ['LIMIT', offset, count] : []),
  ],
  zrevrangebyscore: 3,
  zrevrank: 2,
  zscore: 2,
  zunionstore: [
    3,
    1,
    (
      destination: string,
      keys: string[],
      options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
    ) => {
      const args = [keys.length, ...keys];
      if (options?.weights) args.push('weights', ...options.weights);
      if (options?.aggregate) args.push('aggregate', options.aggregate);
      return args;
    },
  ],
};

export default upstash;
