import fetch from 'isomorphic-unfetch';
import { isFunction } from '../utils/helper';

type ClientObjectProps = {
  url: undefined | string;
  token: undefined | string;
  edgeUrl?: string;
  readFromEdge?: boolean;
};

type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
};

type MethodReturn = Promise<ReturnType>;

type Callback = (res: ReturnType) => any;

type RequestConfig =
  | null
  | undefined
  | {
      edge?: boolean;
    };

type Part = string | boolean | number;

type Bit = 0 | 1;

type Infinities = '+inf' | '-inf';

type ZSetNumber = number | Infinities | string;

/**
 * Upstash Client
 */
export default function client(
  urlOrConfig?: string | undefined | ClientObjectProps,
  token?: string | undefined
) {
  let BASE_URL: undefined | string,
    TOKEN: undefined | string,
    EDGE_URL: undefined | string,
    READ_FROM_EDGE: boolean;

  auth(urlOrConfig, token);

  /**
   * Auth
   */
  function auth(
    urlOrConfig: string | undefined | ClientObjectProps,
    token?: string | undefined
  ) {
    // client({})
    if (typeof urlOrConfig === 'object') {
      BASE_URL = urlOrConfig?.url;
      TOKEN = urlOrConfig?.token;
      EDGE_URL = urlOrConfig?.edgeUrl;
      let fromEdge = urlOrConfig?.readFromEdge ?? true;
      READ_FROM_EDGE = Boolean(EDGE_URL && fromEdge);
    }
    // client(url, token)
    else if (urlOrConfig && token) {
      BASE_URL = urlOrConfig;
      TOKEN = token;
    }
    // try auto fill
    else {
      BASE_URL = process.env.UPSTASH_REDIS_REST_URL;
      TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
      EDGE_URL = process.env.UPSTASH_REDIS_EDGE_URL;
      READ_FROM_EDGE = Boolean(EDGE_URL);
    }
  }

  /**
   * Fetch
   */
  function fetchData(url: string, options: object): Promise<ReturnType> {
    return new Promise((resolve) => {
      fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
        .then((res) => res.json().then())
        .then((data) => {
          if (data.error) throw data.error;
          resolve({
            data: data.result,
            error: null,
          });
        })
        .catch((error) => {
          resolve({
            data: null,
            error: typeof error === 'object' ? error.message : error,
          });
        });
    });
  }

  /**
   * Request
   */
  function request(
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback,
    ...parts: Part[]
  ): MethodReturn {
    if (!BASE_URL || BASE_URL === '') {
      return new Promise((resolve) =>
        resolve({ data: null, error: 'Database url not fount?' })
      );
    }

    let promise: Promise<ReturnType>;
    let isRequestDefaultEdge = Boolean(EDGE_URL && READ_FROM_EDGE);
    let isRequestCustomEdge = false;

    if (typeof configOrCallback === 'object' && configOrCallback !== null) {
      isRequestDefaultEdge =
        isRequestDefaultEdge && configOrCallback?.edge !== false;
      isRequestCustomEdge = Boolean(EDGE_URL && configOrCallback?.edge);
    }

    if (isRequestDefaultEdge || isRequestCustomEdge) {
      const command = encodeURI(parts.join('/'));
      const edgeUrlWithPath = `${EDGE_URL}/${command}`;
      promise = fetchData(edgeUrlWithPath, {
        method: 'GET',
      });
    } else {
      promise = fetchData(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(parts),
      });
    }

    if (isFunction(configOrCallback)) {
      // @ts-ignore
      return promise.then(configOrCallback);
    } else if (isFunction(callback)) {
      return promise.then(callback);
    }

    return promise;
  }

  /*
  ------------------------------------------------
  STRING
  ------------------------------------------------
   */

  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'append', key, value);
  }

  function decr(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'decr', key);
  }

  function decrby(
    key: string,
    decrement: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'decrby', key, decrement);
  }

  function get(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'get', key);
  }

  function getrange(
    key: string,
    start: number,
    end: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'getrange', key, start, end);
  }

  function getset(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'getset', key, value);
  }

  function incr(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'incr', key);
  }

  function incrby(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'incrby', key, value);
  }

  function incrbyfloat(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'incrbyfloat', key, value);
  }

  function mget(
    values: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'mget', ...values);
  }

  function mset(values: string[], callback?: Callback): MethodReturn {
    return request({}, callback, 'mset', ...values);
  }

  function msetnx(values: string[], callback?: Callback): MethodReturn {
    return request({}, callback, 'msetnx', ...values);
  }

  function psetex(
    key: string,
    miliseconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'psetex', key, miliseconds, value);
  }

  function set(
    key: string,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'set', key, value);
  }

  function setex(
    key: string,
    seconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'setex', key, seconds, value);
  }

  function setnx(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'setnx', key, value);
  }

  function setrange(
    key: string,
    offset: number | string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'setrange', key, offset, value);
  }

  function strlen(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'strlen', key);
  }

  /*
  ------------------------------------------------
  BITMAPS
  ------------------------------------------------
   */

  function bitcount(
    key: string,
    start?: number,
    end?: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(configOrCallback, callback, 'bitcount', key, start, end);
    }
    return request(configOrCallback, callback, 'bitcount', key);
  }

  function bitop(
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destinationKey: string,
    sourceKeys: string[],
    callback?: Callback
  ): MethodReturn {
    return request(
      {},
      callback,
      'bitop',
      operation,
      destinationKey,
      ...sourceKeys
    );
  }

  function bitpos(
    key: string,
    bit: Bit,
    start?: number,
    end?: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(
        configOrCallback,
        callback,
        'bitpos',
        key,
        bit,
        start,
        end
      );
    } else if (start !== undefined) {
      return request(configOrCallback, callback, 'bitpos', key, bit, start);
    }
    return request(configOrCallback, callback, 'bitpos', key, bit);
  }

  function getbit(
    key: string,
    offset: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'getbit', key, offset);
  }

  function setbit(
    key: string,
    offset: number,
    value: Bit,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'setbit', key, offset, value);
  }

  /*
  ------------------------------------------------
  CONNECTION
  ------------------------------------------------
   */

  function echo(
    value: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'echo', value);
  }

  function ping(
    value?: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (value) {
      return request(configOrCallback, callback, 'ping', value);
    }
    return request(configOrCallback, callback, 'ping');
  }

  /*
  ------------------------------------------------
  HASHES
  ------------------------------------------------
   */

  function hdel(
    key: string,
    fields: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hdel', key, ...fields);
  }

  function hexists(
    key: string,
    field: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hexists', key, field);
  }

  function hget(
    key: string,
    field: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hget', key, field);
  }

  function hgetall(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hgetall', key);
  }

  function hincrby(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hincrby', key, field, increment);
  }

  function hincrbyfloat(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hincrbyfloat', key, field, increment);
  }

  function hkeys(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hkeys', key);
  }

  function hlen(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hlen', key);
  }

  function hmget(
    key: string,
    fields: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hmget', key, ...fields);
  }

  function hmset(
    key: string,
    values: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hmset', key, ...values);
  }

  function hscan(
    key: string,
    cursor: number,
    options?: { match?: number | string; count?: number | string },
    callback?: Callback
  ): MethodReturn {
    if (options?.match && options?.count) {
      return request(
        {},
        callback,
        'hscan',
        key,
        cursor,
        'match',
        options.match,
        'count',
        options.count
      );
    } else if (options?.match) {
      return request(
        {},
        callback,
        'hscan',
        key,
        cursor,
        'match',
        options.match
      );
    } else if (options?.count) {
      return request(
        {},
        callback,
        'hscan',
        key,
        cursor,
        'count',
        options.count
      );
    }
    return request({}, callback, 'hscan', key, cursor);
  }

  function hset(
    key: string,
    values: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hset', key, ...values);
  }

  function hsetnx(
    key: string,
    field: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'hsetnx', key, field, value);
  }

  function hvals(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'hvals', key);
  }

  /*
  ------------------------------------------------
  KEYS
  ------------------------------------------------
   */

  function del(keys: string[], callback?: Callback): MethodReturn {
    return request({}, callback, 'del', ...keys);
  }

  function exists(
    keys: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'exists', ...keys);
  }

  function expire(
    key: string,
    seconds: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'expire', key, seconds);
  }

  function expireat(
    key: string,
    timestamp: number | string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'expireat', key, timestamp);
  }

  function keys(
    pattern: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'keys', pattern);
  }

  function persist(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'persist', key);
  }

  function pexpire(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'pexpire', key, miliseconds);
  }

  function pexpireat(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'pexpireat', key, miliseconds);
  }

  function pttl(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'pttl', key);
  }

  function randomkey(callback?: Callback): MethodReturn {
    return request({}, callback, 'randomkey');
  }

  function rename(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'rename', key, newkey);
  }

  function renamenx(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'renamenx', key, newkey);
  }

  function scan(
    cursor: number,
    opitons?: { match?: number | string; count?: number | string },
    callback?: Callback
  ): MethodReturn {
    if (opitons?.match && opitons?.count) {
      return request(
        {},
        callback,
        'scan',
        cursor,
        'match',
        opitons.match,
        'count',
        opitons.count
      );
    } else if (opitons?.match) {
      return request({}, callback, 'scan', cursor, 'match', opitons.match);
    } else if (opitons?.count) {
      return request({}, callback, 'scan', cursor, 'count', opitons.count);
    }
    return request({}, callback, 'scan', cursor);
  }

  function touch(keys: string[], callback?: Callback): MethodReturn {
    return request({}, callback, 'touch', ...keys);
  }

  function ttl(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'ttl', key);
  }

  function type(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'type', key);
  }

  function unlink(keys: string[], callback?: Callback): MethodReturn {
    return request({}, callback, 'unlink', ...keys);
  }

  /*
  ------------------------------------------------
  LISTS
  ------------------------------------------------
   */

  function lindex(
    key: string,
    index: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'lindex', key, index);
  }

  function linsert(
    key: string,
    option: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'linsert', key, option, pivot, element);
  }

  function llen(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'llen', key);
  }

  function lpop(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'lpop', key);
  }

  function lpush(
    key: string,
    elements: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'lpush', key, ...elements);
  }

  function lpushx(
    key: string,
    elements: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'lpushx', key, ...elements);
  }

  function lrange(
    key: string,
    start: number,
    stop: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'lrange', key, start, stop);
  }

  function lrem(
    key: string,
    count: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'lrem', key, count, element);
  }

  function lset(
    key: string,
    index: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'lset', key, index, element);
  }

  function ltrim(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'ltrim', key, start, stop);
  }

  function rpop(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'rpop', key);
  }

  function rpoplpush(
    source: string,
    destination: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'rpoplpush', source, destination);
  }

  function rpush(
    key: string,
    elements: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'rpush', key, ...elements);
  }

  function rpushx(
    key: string,
    elements: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'rpushx', key, ...elements);
  }

  /*
  ------------------------------------------------
  SERVER
  ------------------------------------------------
   */

  function dbsize(
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'dbsize');
  }

  function flushall(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request({}, callback, 'flushall', mode);
    }
    return request({}, callback, 'flushall');
  }

  function flushdb(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request({}, callback, 'flushdb', mode);
    }
    return request({}, callback, 'flushdb');
  }

  function info(
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'info');
  }

  function time(callback?: Callback): MethodReturn {
    return request({}, callback, 'time');
  }

  /*
  ------------------------------------------------
  SET
  ------------------------------------------------
   */

  function sadd(
    key: string,
    members: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'sadd', key, ...members);
  }

  function scard(key: string, callback?: Callback): MethodReturn {
    return request({}, callback, 'scard', key);
  }

  function sdiff(
    keys: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'sdiff', ...keys);
  }

  function sdiffstore(
    destination: string,
    keys: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'sdiffstore', destination, ...keys);
  }

  function sinter(
    keys: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'sinter', ...keys);
  }

  function sinterstore(
    destination: string,
    keys: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'sinterstore', destination, ...keys);
  }

  function sismember(
    key: string,
    member: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'sismember', key, member);
  }

  function smembers(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'smembers', key);
  }

  function smove(
    source: string,
    destination: string,
    member: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'smove', source, destination, member);
  }

  function spop(
    key: string,
    count?: number,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request({}, callback, 'spop', key, count);
    }
    return request({}, callback, 'spop', key);
  }

  function srandmember(
    key: string,
    count?: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request(configOrCallback, callback, 'srandmember', key, count);
    }
    return request(configOrCallback, callback, 'srandmember', key);
  }

  function srem(
    key: string,
    members: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'srem', key, ...members);
  }

  function sunion(
    keys: string[],
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'sunion', ...keys);
  }

  function sunionstore(
    destination: string,
    keys: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'sunionstore', destination, ...keys);
  }

  /*
  ------------------------------------------------
  SORTED SETS
  ------------------------------------------------
   */

  function zadd(
    key: string,
    values: ZSetNumber[],
    options?: ({ xx?: boolean } | { nx?: boolean }) & {
      ch?: boolean;
      incr: boolean;
    },
    callback?: Callback
  ): MethodReturn {
    if (options) {
      const allOptions = Object.entries(options)
        .filter((e) => ['string', 'number', 'boolean'].includes(typeof e[1]))
        .map((e) => e[0].toUpperCase());

      return request({}, callback, 'zadd', key, ...allOptions, ...values);
    }
    return request({}, callback, 'zadd', key, ...values);
  }

  function zcard(
    key: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zcard', key);
  }

  function zcount(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zcount', key, min, max);
  }

  function zincrby(
    key: string,
    increment: number | string,
    member: string,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'zincrby', key, increment, member);
  }

  function zinterstore(
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' },
    callback?: Callback
  ): MethodReturn {
    if (options) {
      if (options.weights && options.aggregate) {
        return request(
          {},
          callback,
          'zinterstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights,
          'aggregate',
          options.aggregate
        );
      } else if (options.weights) {
        return request(
          {},
          callback,
          'zinterstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights
        );
      } else if (options.aggregate) {
        return request(
          {},
          callback,
          'zinterstore',
          destination,
          keys.length,
          ...keys,
          'aggregate',
          options.aggregate
        );
      }
    }
    return request(
      {},
      callback,
      'zinterstore',
      destination,
      keys.length,
      ...keys
    );
  }

  function zlexcount(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zlexcount', key, min, max);
  }

  function zpopmax(
    key: string,
    count?: number,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request({}, callback, 'zpopmax', key, count);
    }
    return request({}, callback, 'zpopmax', key);
  }

  function zpopmin(
    key: string,
    count?: number,
    callback?: Callback
  ): MethodReturn {
    if (count) {
      return request({}, callback, 'zpopmin', key, count);
    }
    return request({}, callback, 'zpopmin', key);
  }

  function zrange(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: { withScores: boolean },
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (options?.withScores) {
      return request(
        configOrCallback,
        callback,
        'zrange',
        key,
        min,
        max,
        'WITHSCORES'
      );
    }
    return request(configOrCallback, callback, 'zrange', key, min, max);
  }

  function zrangebylex(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    offset?: number,
    count?: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (offset && count) {
      return request(
        configOrCallback,
        callback,
        'zrangebylex',
        key,
        min,
        max,
        'LIMIT',
        offset,
        count
      );
    }
    return request({}, callback, 'zrangebylex', key, min, max);
  }

  function zrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: {
      withScores?: boolean;
      limit?: { offset: number; count: number };
    },
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (options?.withScores && options?.limit) {
      return request(
        configOrCallback,
        callback,
        'zrangebyscore',
        key,
        min,
        max,
        'WITHSCORES',
        'LIMIT',
        options.limit.offset,
        options.limit.count
      );
    } else if (options?.withScores) {
      return request(
        configOrCallback,
        callback,
        'zrangebyscore',
        key,
        min,
        max,
        'WITHSCORES'
      );
    } else if (options?.limit) {
      return request(
        configOrCallback,
        callback,
        'zrangebyscore',
        key,
        min,
        max,
        'LIMIT',
        options.limit.offset,
        options.limit.count
      );
    }
    return request({}, callback, 'zrangebyscore', key, min, max);
  }

  function zrank(
    key: string,
    member: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zrank', key, member);
  }

  function zrem(
    key: string,
    members: string[],
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'zrem', key, ...members);
  }

  function zremrangebylex(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'zremrangebylex', key, min, max);
  }

  function zremrangebyrank(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'zremrangebyrank', key, start, stop);
  }

  function zremrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    callback?: Callback
  ): MethodReturn {
    return request({}, callback, 'zremrangebyscore', key, min, max);
  }

  function zrevrange(
    key: string,
    start: number,
    stop: number,
    options?: { withScores: boolean },
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (options?.withScores) {
      return request(
        configOrCallback,
        callback,
        'zrevrange',
        key,
        start,
        stop,
        'WITHSCORES'
      );
    }
    return request(configOrCallback, callback, 'zrevrange', key, start, stop);
  }

  function zrevrangebylex(
    key: string,
    max: ZSetNumber,
    min: ZSetNumber,
    offset?: number,
    count?: number,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    if (offset && count) {
      return request(
        configOrCallback,
        callback,
        'zrevrangebylex',
        key,
        max,
        min,
        'LIMIT',
        offset,
        count
      );
    }
    return request(configOrCallback, callback, 'zrevrangebylex', key, max, min);
  }

  function zrevrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(
      configOrCallback,
      callback,
      'zrevrangebyscore',
      key,
      min,
      max
    );
  }

  function zrevrank(
    key: string,
    member: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zrevrank', key, member);
  }

  function zscore(
    key: string,
    member: string,
    configOrCallback?: RequestConfig | Callback,
    callback?: Callback
  ): MethodReturn {
    return request(configOrCallback, callback, 'zscore', key, member);
  }

  function zunionstore(
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' },
    callback?: Callback
  ): MethodReturn {
    if (options) {
      if (options.weights && options.aggregate) {
        return request(
          {},
          callback,
          'zunionstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights,
          'aggregate',
          options.aggregate
        );
      } else if (options.weights) {
        return request(
          {},
          callback,
          'zunionstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights
        );
      } else if (options.aggregate) {
        return request(
          {},
          callback,
          'zunionstore',
          destination,
          keys.length,
          ...keys,
          'aggregate',
          options.aggregate
        );
      }
    }
    return request(
      {},
      callback,
      'zunionstore',
      destination,
      keys.length,
      ...keys
    );
  }

  return {
    auth,
    // STRING
    append,
    decr,
    decrby,
    get,
    getrange,
    getset,
    incr,
    incrby,
    incrbyfloat,
    mget,
    mset,
    msetnx,
    psetex,
    set,
    setex,
    setnx,
    setrange,
    strlen,
    // BITMAPS
    bitcount,
    bitop,
    bitpos,
    getbit,
    setbit,
    // CONNECTION
    echo,
    ping,
    //HASHES
    hdel,
    hexists,
    hget,
    hgetall,
    hincrby,
    hincrbyfloat,
    hkeys,
    hlen,
    hmget,
    hmset,
    hset,
    hsetnx,
    hvals,
    hscan,
    // KEYS
    del,
    exists,
    expire,
    expireat,
    keys,
    persist,
    pexpire,
    pexpireat,
    pttl,
    randomkey,
    rename,
    renamenx,
    scan,
    touch,
    ttl,
    type,
    unlink,
    // LIST
    lindex,
    linsert,
    llen,
    lpop,
    lpush,
    lpushx,
    lrange,
    lrem,
    lset,
    ltrim,
    rpop,
    rpoplpush,
    rpush,
    rpushx,
    // SERVER
    dbsize,
    flushall,
    flushdb,
    info,
    time,
    //SET
    sadd,
    scard,
    sdiff,
    sdiffstore,
    sinter,
    sinterstore,
    sismember,
    smembers,
    smove,
    spop,
    srandmember,
    srem,
    sunion,
    sunionstore,
    //sorted
    zadd,
    zcard,
    zcount,
    zincrby,
    zinterstore,
    zlexcount,
    zpopmax,
    zpopmin,
    zrange,
    zrangebylex,
    zrangebyscore,
    zrank,
    zrem,
    zremrangebylex,
    zremrangebyrank,
    zremrangebyscore,
    zrevrange,
    zrevrangebylex,
    zrevrangebyscore,
    zrevrank,
    zscore,
    zunionstore,
  };
}
