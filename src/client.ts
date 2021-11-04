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
  edgeUrl?: string,
  readFromEdge?: boolean
): ClientObjectProps {
  // try auto fill from env variables
  if (!url) url = process.env.UPSTASH_REDIS_REST_URL;
  if (!token) token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!edgeUrl) edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;
  readFromEdge = readFromEdge ?? !!edgeUrl;

  if (!url) throw new Error('REST Url is missing');
  if (!token) throw new Error('REST token is missing');

  if (typeof url !== 'string')
    return parseOptions(url.url, url.token, url.edgeUrl, url.readFromEdge);
  return edgeUrl ? { url, token, edgeUrl, readFromEdge } : { url, token };
}

function parseUrl(url: string) {
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  return url;
}

function request(
  config: { options: ClientObjectProps; edge?: boolean },
  args: Part[]
) {
  const { options, edge = false } = config;
  let fromEdge = !!options.edgeUrl && (edge || options.readFromEdge);

  if (!options.edgeUrl && edge) {
    throw new Error(`"edge: true" is being used but the Edge Url is missing`);
  }

  if (fromEdge) {
    const command = encodeURI(args.join('/'));
    const edgeUrlWithPath = `${options.edgeUrl}/${command}`;
    return fetchData(parseUrl(edgeUrlWithPath), options, { method: 'GET' });
  } else {
    return fetchData(parseUrl(options.url), options, {
      method: 'POST',
      body: JSON.stringify(args),
    });
  }
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

type CustomArgsFn = (...args: any[]) => any[];

type StaticArgs = number | 'spread';

type PossibleArgs =
  | number
  | ((options: ClientObjectProps, ...args: any[]) => any)
  | [number, ...(StaticArgs | CustomArgsFn)[]];

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
          argsCount = [argsCount, argsCount];
        }

        const opArgs: any[] = [];
        const knownArgsCount = argsCount[0];
        let nextArg = 0;

        for (const arg of argsCount.slice(1)) {
          if (typeof arg === 'function') {
            opArgs.push(...arg(...args));
            // There can only be one function defined
            break;
          }
          if (arg === 'spread') {
            opArgs.push(...args[nextArg]);
            // There can only be one spread defined
            break;
          }
          opArgs.push(...args.slice(nextArg, nextArg + arg));
          nextArg += arg;
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

        return request({ options, ...configOrCb }, opArgs).then(cb);
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
  append: 2,
  decr: 1,
  decrby: 2,
  get: 1,
  getrange: 3,
  getset: 2,
  incr: 1,
  incrby: 2,
  incrbyfloat: 2,
  mget: [1, 'spread'],
  mset: [1, 'spread'],
  msetnx: [1, 'spread'],
  psetex: 3,
  set: 2,
  setex: 3,
  setnx: 2,
  setrange: 3,
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
  setbit: 3,
  /**
   * CONNECTION
   */
  echo: 1,
  ping: [1, (value?: string) => (value ? [value] : [])],
  hdel: [2, 1, 'spread'],
  hexists: 2,
  hget: 2,
  hgetall: 1,
  hincrby: 3,
  hincrbyfloat: 3,
  hkeys: 1,
  hlen: 1,
  hmget: [2, 1, 'spread'],
  hmset: [2, 1, 'spread'],
  hscan: [
    3,
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
  hset: [2, 1, 'spread'],
  hsetnx: 3,
  hvals: 1,
  /**
   * KEYS
   */
  del: [1, 'spread'],
  exists: [1, 'spread'],
  expire: 2,
  expireat: 2,
  keys: 1,
  persist: 1,
  pexpire: 2,
  pexpireat: 2,
  pttl: 1,
  randomkey: 0,
  rename: 2,
  renamenx: 2,
  scan: [
    2,
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
  touch: [1, 'spread'],
  ttl: 1,
  type: 1,
  unlink: [1, 'spread'],
  /**
   * LISTS
   */
  lindex: 2,
  linsert: 4,
  llen: 1,
  lpop: 1,
  lpush: [2, 1, 'spread'],
  lpushx: [2, 1, 'spread'],
  lrange: 3,
  lrem: 3,
  lset: 3,
  ltrim: 3,
  rpop: 1,
  rpoplpush: 2,
  rpush: [2, 1, 'spread'],
  rpushx: [2, 1, 'spread'],
  /**
   * SERVER
   */
  dbsize: 0,
  flushall: [1, (mode?: 'ASYNC') => (mode ? [mode] : [])],
  flushdb: [1, (mode?: 'ASYNC') => (mode ? [mode] : [])],
  info: 0,
  time: 0,
  /**
   * SET
   */
  sadd: [2, 1, 'spread'],
  scard: 1,
  sdiff: [1, 'spread'],
  sdiffstore: [2, 1, 'spread'],
  sinter: [1, 'spread'],
  sinterstore: [2, 1, 'spread'],
  sismember: 2,
  smembers: 1,
  smove: 3,
  spop: [2, 1, (key: string, count?: number) => (count ? [count] : [])],
  srandmember: [2, 1, (key: string, count?: number) => (count ? [count] : [])],
  srem: [2, 1, 'spread'],
  sunion: [1, 'spread'],
  sunionstore: [2, 1, 'spread'],
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
  zincrby: 3,
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
  zpopmax: [2, 1, (key: string, count?: number) => (count ? [count] : [])],
  zpopmin: [2, 1, (key: string, count?: number) => (count ? [count] : [])],
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
  zrem: [2, 1, 'spread'],
  zremrangebylex: 3,
  zremrangebyrank: 3,
  zremrangebyscore: 3,
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
