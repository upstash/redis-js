import fetch from 'isomorphic-unfetch';
import { isFunction, isObject, isString } from '../utils/helper';
import {
  ClientObjectProps,
  ReturnType,
  RequestConfig,
  Callback,
  MethodReturn,
  Part,
  Upstash,
  Bit,
  ZSetNumber,
} from './type';

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
export default Upstash;
function Upstash(url?: string, token?: string): Upstash;
function Upstash(options?: ClientObjectProps): Upstash;
function Upstash(): Upstash {
  let OPTIONS: {
    url: string;
    token: string;
    edgeUrl?: string;
    readFromEdge?: boolean;
  };

  // @ts-ignore
  parseOptions(arguments[0], arguments[1]);

  /**
   * Parse Options
   */
  function parseOptions() {
    const arg0 = arguments[0];
    const arg1 = arguments[1];

    OPTIONS = { url: '', token: '', edgeUrl: '', readFromEdge: false };

    // Upstash({})
    if (isObject(arg0)) {
      const { url, token, edgeUrl, readFromEdge } = arg0;
      OPTIONS.url = url;
      OPTIONS.token = token;
      OPTIONS.edgeUrl = edgeUrl;
      OPTIONS.readFromEdge = readFromEdge;
    }
    // Upstash(url, token)
    else if (isString(arg0) && isString(arg1)) {
      OPTIONS.url = arg0;
      OPTIONS.token = arg1;
    }
    // try auto fill from env variable
    else if (process) {
      const {
        UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN,
        UPSTASH_REDIS_EDGE_URL,
      } = process.env;
      OPTIONS.url = UPSTASH_REDIS_REST_URL ?? '';
      OPTIONS.token = UPSTASH_REDIS_REST_TOKEN ?? '';
      OPTIONS.edgeUrl = UPSTASH_REDIS_EDGE_URL ?? '';
      OPTIONS.readFromEdge = !!UPSTASH_REDIS_EDGE_URL;
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
          Authorization: `Bearer ${OPTIONS.token}`,
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
    if (!OPTIONS.url || OPTIONS.url === '') {
      return new Promise((resolve) =>
        resolve({ data: null, error: 'Database url not found?' })
      );
    }

    let promise: Promise<ReturnType>;
    let isRequestDefaultEdge = Boolean(OPTIONS.edgeUrl && OPTIONS.readFromEdge);
    let isRequestCustomEdge = false;

    if (isObject(configOrCallback)) {
      isRequestDefaultEdge =
        isRequestDefaultEdge && arguments[0]?.edge !== false;
      // @ts-ignore
      isRequestCustomEdge = Boolean(
        arguments[0]?.edgeUrl && arguments[0]?.edge
      );
    }

    if (isRequestDefaultEdge || isRequestCustomEdge) {
      const command = encodeURI(parts.join('/'));
      const edgeUrlWithPath = `${OPTIONS.edgeUrl}/${command}`;
      promise = fetchData(edgeUrlWithPath, {
        method: 'GET',
      });
    } else {
      promise = fetchData(OPTIONS.url, {
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

  /**
   * Auth
   */
  function auth(url?: string, token?: string): void;
  function auth(options?: ClientObjectProps): void;
  function auth(): void {
    // @ts-ignore
    parseOptions(arguments[0], arguments[1]);
  }

  /**
   * STRING
   */

  function append(key: string, value: string): MethodReturn {
    return request(undefined, arguments[2], 'append', key, value);
  }

  function decr(key: string): MethodReturn {
    return request(undefined, arguments[1], 'decr', key);
  }

  function decrby(key: string, decrement: number): MethodReturn {
    return request(undefined, arguments[2], 'decrby', key, decrement);
  }

  function get(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'get', key);
  }

  function getrange(key: string, start: number, end: number): MethodReturn {
    return request(arguments[3], arguments[4], 'getrange', key, start, end);
  }

  function getset(key: string, value: string): MethodReturn {
    return request(undefined, arguments[2], 'getset', key, value);
  }

  function incr(key: string): MethodReturn {
    return request(undefined, arguments[1], 'incr', key);
  }

  function incrby(key: string, value: number | string): MethodReturn {
    return request(undefined, arguments[2], 'incrby', key, value);
  }

  function incrbyfloat(key: string, value: number | string): MethodReturn {
    return request(undefined, arguments[2], 'incrbyfloat', key, value);
  }

  function mget(values: string[]): MethodReturn {
    return request(arguments[1], arguments[2], 'mget', ...values);
  }

  function mset(values: string[]): MethodReturn {
    return request(undefined, arguments[1], 'mset', ...values);
  }

  function msetnx(values: string[]): MethodReturn {
    return request(undefined, arguments[1], 'msetnx', ...values);
  }

  function psetex(
    key: string,
    miliseconds: number,
    value: string | number
  ): MethodReturn {
    return request(undefined, arguments[3], 'psetex', key, miliseconds, value);
  }

  function set(key: string, value: string | number): MethodReturn {
    return request(undefined, arguments[2], 'set', key, value);
  }

  function setex(
    key: string,
    seconds: number,
    value: string | number
  ): MethodReturn {
    return request(undefined, arguments[3], 'setex', key, seconds, value);
  }

  function setnx(key: string, value: string): MethodReturn {
    return request(undefined, arguments[2], 'setnx', key, value);
  }

  function setrange(
    key: string,
    offset: number | string,
    value: string
  ): MethodReturn {
    return request(undefined, arguments[3], 'setrange', key, offset, value);
  }

  function strlen(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'strlen', key);
  }

  /**
   * BITMAPS
   */

  function bitcount(key: string, start?: number, end?: number): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(arguments[3], arguments[4], 'bitcount', key, start, end);
    }
    return request(arguments[3], arguments[4], 'bitcount', key);
  }

  function bitop(
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destinationKey: string,
    sourceKeys: string[]
  ): MethodReturn {
    return request(
      undefined,
      arguments[3],
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
    end?: number
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(
        arguments[4],
        arguments[5],
        'bitpos',
        key,
        bit,
        start,
        end
      );
    } else if (start !== undefined) {
      return request(arguments[4], arguments[5], 'bitpos', key, bit, start);
    }
    return request(arguments[4], arguments[5], 'bitpos', key, bit);
  }

  function getbit(key: string, offset: number): MethodReturn {
    return request(arguments[2], arguments[3], 'getbit', key, offset);
  }

  function setbit(key: string, offset: number, value: Bit): MethodReturn {
    return request(undefined, arguments[3], 'setbit', key, offset, value);
  }

  /**
   * CONNECTION
   */

  function echo(value: string): MethodReturn {
    return request(arguments[1], arguments[2], 'echo', value);
  }

  function ping(value?: string): MethodReturn {
    if (value) {
      return request(arguments[1], arguments[2], 'ping', value);
    }
    return request(arguments[1], arguments[2], 'ping');
  }

  /**
   * HASHES
   */

  function hdel(key: string, fields: string[]): MethodReturn {
    return request(undefined, arguments[2], 'hdel', key, ...fields);
  }

  function hexists(key: string, field: string): MethodReturn {
    return request(arguments[2], arguments[3], 'hexists', key, field);
  }

  function hget(key: string, field: string): MethodReturn {
    return request(arguments[2], arguments[3], 'hget', key, field);
  }

  function hgetall(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'hgetall', key);
  }

  function hincrby(
    key: string,
    field: string,
    increment: number | string
  ): MethodReturn {
    return request(undefined, arguments[3], 'hincrby', key, field, increment);
  }

  function hincrbyfloat(
    key: string,
    field: string,
    increment: number | string
  ): MethodReturn {
    return request(
      undefined,
      arguments[3],
      'hincrbyfloat',
      key,
      field,
      increment
    );
  }

  function hkeys(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'hkeys', key);
  }

  function hlen(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'hlen', key);
  }

  function hmget(key: string, fields: string[]): MethodReturn {
    return request(arguments[2], arguments[3], 'hmget', key, ...fields);
  }

  function hmset(key: string, values: string[]): MethodReturn {
    return request(undefined, arguments[2], 'hmset', key, ...values);
  }

  function hscan(
    key: string,
    cursor: number,
    options?: { match?: number | string; count?: number | string }
  ): MethodReturn {
    if (options?.match && options?.count) {
      return request(
        undefined,
        arguments[3],
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
        undefined,
        arguments[3],
        'hscan',
        key,
        cursor,
        'match',
        options.match
      );
    } else if (options?.count) {
      return request(
        undefined,
        arguments[3],
        'hscan',
        key,
        cursor,
        'count',
        options.count
      );
    }
    return request(undefined, arguments[3], 'hscan', key, cursor);
  }

  function hset(key: string, values: string[]): MethodReturn {
    return request(undefined, arguments[2], 'hset', key, ...values);
  }

  function hsetnx(key: string, field: string, value: string): MethodReturn {
    return request(undefined, arguments[3], 'hsetnx', key, field, value);
  }

  function hvals(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'hvals', key);
  }

  /**
   * KEYS
   */

  function del(keys: string[]): MethodReturn {
    return request(undefined, arguments[1], 'del', ...keys);
  }

  function exists(keys: string[]): MethodReturn {
    return request(arguments[1], arguments[2], 'exists', ...keys);
  }

  function expire(key: string, seconds: number): MethodReturn {
    return request(undefined, arguments[2], 'expire', key, seconds);
  }

  function expireat(key: string, timestamp: number | string): MethodReturn {
    return request(undefined, arguments[2], 'expireat', key, timestamp);
  }

  function keys(pattern: string): MethodReturn {
    return request(arguments[1], arguments[2], 'keys', pattern);
  }

  function persist(key: string): MethodReturn {
    return request(undefined, arguments[1], 'persist', key);
  }

  function pexpire(key: string, miliseconds: number): MethodReturn {
    return request(undefined, arguments[2], 'pexpire', key, miliseconds);
  }

  function pexpireat(key: string, miliseconds: number): MethodReturn {
    return request(undefined, arguments[2], 'pexpireat', key, miliseconds);
  }

  function pttl(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'pttl', key);
  }

  function randomkey(): MethodReturn {
    return request(undefined, arguments[0], 'randomkey');
  }

  function rename(key: string, newKey: string): MethodReturn {
    return request(undefined, arguments[2], 'rename', key, newKey);
  }

  function renamenx(key: string, newKey: string): MethodReturn {
    return request(undefined, arguments[2], 'renamenx', key, newKey);
  }

  function scan(
    cursor: number,
    opitons?: { match?: number | string; count?: number | string }
  ): MethodReturn {
    if (opitons?.match && opitons?.count) {
      return request(
        undefined,
        arguments[2],
        'scan',
        cursor,
        'match',
        opitons.match,
        'count',
        opitons.count
      );
    } else if (opitons?.match) {
      return request(
        undefined,
        arguments[2],
        'scan',
        cursor,
        'match',
        opitons.match
      );
    } else if (opitons?.count) {
      return request(
        undefined,
        arguments[2],
        'scan',
        cursor,
        'count',
        opitons.count
      );
    }
    return request(undefined, arguments[2], 'scan', cursor);
  }

  function touch(keys: string[]): MethodReturn {
    return request(undefined, arguments[1], 'touch', ...keys);
  }

  function ttl(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'ttl', key);
  }

  function type(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'type', key);
  }

  function unlink(keys: string[]): MethodReturn {
    return request(undefined, arguments[1], 'unlink', ...keys);
  }

  /**
   * LISTS
   */

  function lindex(key: string, index: number): MethodReturn {
    return request(arguments[2], arguments[3], 'lindex', key, index);
  }

  function linsert(
    key: string,
    option: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string
  ): MethodReturn {
    return request(
      undefined,
      arguments[4],
      'linsert',
      key,
      option,
      pivot,
      element
    );
  }

  function llen(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'llen', key);
  }

  function lpop(key: string): MethodReturn {
    return request(undefined, arguments[1], 'lpop', key);
  }

  function lpush(key: string, elements: string[]): MethodReturn {
    return request(undefined, arguments[2], 'lpush', key, ...elements);
  }

  function lpushx(key: string, elements: string[]): MethodReturn {
    return request(undefined, arguments[2], 'lpushx', key, ...elements);
  }

  function lrange(key: string, start: number, stop: number): MethodReturn {
    return request(arguments[3], arguments[4], 'lrange', key, start, stop);
  }

  function lrem(key: string, count: number, element: string): MethodReturn {
    return request(undefined, arguments[3], 'lrem', key, count, element);
  }

  function lset(key: string, index: number, element: string): MethodReturn {
    return request(undefined, arguments[3], 'lset', key, index, element);
  }

  function ltrim(key: string, start: number, stop: number): MethodReturn {
    return request(undefined, arguments[3], 'ltrim', key, start, stop);
  }

  function rpop(key: string): MethodReturn {
    return request(undefined, arguments[1], 'rpop', key);
  }

  function rpoplpush(source: string, destination: string): MethodReturn {
    return request(undefined, arguments[2], 'rpoplpush', source, destination);
  }

  function rpush(key: string, elements: string[]): MethodReturn {
    return request(undefined, arguments[2], 'rpush', key, ...elements);
  }

  function rpushx(key: string, elements: string[]): MethodReturn {
    return request(undefined, arguments[2], 'rpushx', key, ...elements);
  }

  /**
   * SERVER
   */

  function dbsize(): MethodReturn {
    return request(arguments[0], arguments[1], 'dbsize');
  }

  function flushall(mode?: 'ASYNC'): MethodReturn {
    if (mode) {
      return request(undefined, arguments[1], 'flushall', mode);
    }
    return request(undefined, arguments[1], 'flushall');
  }

  function flushdb(mode?: 'ASYNC'): MethodReturn {
    if (mode) {
      return request(undefined, arguments[1], 'flushdb', mode);
    }
    return request(undefined, arguments[1], 'flushdb');
  }

  function info(): MethodReturn {
    return request(arguments[0], arguments[1], 'info');
  }

  function time(): MethodReturn {
    return request(undefined, arguments[0], 'time');
  }

  /**
   * SET
   */

  function sadd(key: string, members: string[]): MethodReturn {
    return request(undefined, arguments[2], 'sadd', key, ...members);
  }

  function scard(key: string): MethodReturn {
    return request(undefined, arguments[1], 'scard', key);
  }

  function sdiff(keys: string[]): MethodReturn {
    return request(arguments[1], arguments[2], 'sdiff', ...keys);
  }

  function sdiffstore(destination: string, keys: string[]): MethodReturn {
    return request(undefined, arguments[2], 'sdiffstore', destination, ...keys);
  }

  function sinter(keys: string[]): MethodReturn {
    return request(arguments[1], arguments[2], 'sinter', ...keys);
  }

  function sinterstore(destination: string, keys: string[]): MethodReturn {
    return request(
      undefined,
      arguments[2],
      'sinterstore',
      destination,
      ...keys
    );
  }

  function sismember(key: string, member: string): MethodReturn {
    return request(arguments[2], arguments[3], 'sismember', key, member);
  }

  function smembers(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'smembers', key);
  }

  function smove(
    source: string,
    destination: string,
    member: string
  ): MethodReturn {
    return request(
      undefined,
      arguments[3],
      'smove',
      source,
      destination,
      member
    );
  }

  function spop(key: string, count?: number): MethodReturn {
    if (count) {
      return request(undefined, arguments[2], 'spop', key, count);
    }
    return request(undefined, arguments[2], 'spop', key);
  }

  function srandmember(key: string, count?: number): MethodReturn {
    if (count) {
      return request(arguments[2], arguments[3], 'srandmember', key, count);
    }
    return request(arguments[2], arguments[3], 'srandmember', key);
  }

  function srem(key: string, members: string[]): MethodReturn {
    return request(undefined, arguments[2], 'srem', key, ...members);
  }

  function sunion(keys: string[]): MethodReturn {
    return request(arguments[1], arguments[2], 'sunion', ...keys);
  }

  function sunionstore(destination: string, keys: string[]): MethodReturn {
    return request(
      undefined,
      arguments[2],
      'sunionstore',
      destination,
      ...keys
    );
  }

  /**
   * SORTED SETS
   */

  function zadd(
    key: string,
    values: ZSetNumber[],
    options?: ({ xx?: boolean } | { nx?: boolean }) & {
      ch?: boolean;
      incr: boolean;
    }
  ): MethodReturn {
    if (options) {
      const allOptions = Object.entries(options)
        .filter((e) => ['string', 'number', 'boolean'].includes(typeof e[1]))
        .map((e) => e[0].toUpperCase());

      return request(
        undefined,
        arguments[3],
        'zadd',
        key,
        ...allOptions,
        ...values
      );
    }
    return request(arguments[3], arguments[4], 'zadd', key, ...values);
  }

  function zcard(key: string): MethodReturn {
    return request(arguments[1], arguments[2], 'zcard', key);
  }

  function zcount(key: string, min: ZSetNumber, max: ZSetNumber): MethodReturn {
    return request(arguments[3], arguments[4], 'zcount', key, min, max);
  }

  function zincrby(
    key: string,
    increment: number | string,
    member: string
  ): MethodReturn {
    return request(undefined, arguments[3], 'zincrby', key, increment, member);
  }

  function zinterstore(
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
  ): MethodReturn {
    if (options) {
      if (options.weights && options.aggregate) {
        return request(
          undefined,
          arguments[3],
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
          undefined,
          arguments[3],
          'zinterstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights
        );
      } else if (options.aggregate) {
        return request(
          undefined,
          arguments[3],
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
      undefined,
      arguments[3],
      'zinterstore',
      destination,
      keys.length,
      ...keys
    );
  }

  function zlexcount(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ): MethodReturn {
    return request(arguments[3], arguments[4], 'zlexcount', key, min, max);
  }

  function zpopmax(key: string, count?: number): MethodReturn {
    if (count) {
      return request(undefined, arguments[2], 'zpopmax', key, count);
    }
    return request(undefined, arguments[2], 'zpopmax', key);
  }

  function zpopmin(key: string, count?: number): MethodReturn {
    if (count) {
      return request(undefined, arguments[2], 'zpopmin', key, count);
    }
    return request(undefined, arguments[2], 'zpopmin', key);
  }

  function zrange(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: { withScores: boolean }
  ): MethodReturn {
    if (options?.withScores) {
      return request(
        arguments[4],
        arguments[5],
        'zrange',
        key,
        min,
        max,
        'WITHSCORES'
      );
    }
    return request(arguments[4], arguments[5], 'zrange', key, min, max);
  }

  function zrangebylex(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    offset?: number,
    count?: number
  ): MethodReturn {
    if (offset && count) {
      return request(
        arguments[5],
        arguments[6],
        'zrangebylex',
        key,
        min,
        max,
        'LIMIT',
        offset,
        count
      );
    }
    return request(arguments[5], arguments[6], 'zrangebylex', key, min, max);
  }

  function zrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: {
      withScores?: boolean;
      limit?: { offset: number; count: number };
    }
  ): MethodReturn {
    if (options?.withScores && options?.limit) {
      return request(
        arguments[4],
        arguments[5],
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
        arguments[4],
        arguments[5],
        'zrangebyscore',
        key,
        min,
        max,
        'WITHSCORES'
      );
    } else if (options?.limit) {
      return request(
        arguments[4],
        arguments[5],
        'zrangebyscore',
        key,
        min,
        max,
        'LIMIT',
        options.limit.offset,
        options.limit.count
      );
    }
    return request(arguments[4], arguments[5], 'zrangebyscore', key, min, max);
  }

  function zrank(key: string, member: string): MethodReturn {
    return request(arguments[2], arguments[3], 'zrank', key, member);
  }

  function zrem(key: string, members: string[]): MethodReturn {
    return request(undefined, arguments[2], 'zrem', key, ...members);
  }

  function zremrangebylex(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ): MethodReturn {
    return request(undefined, arguments[3], 'zremrangebylex', key, min, max);
  }

  function zremrangebyrank(
    key: string,
    start: number,
    stop: number
  ): MethodReturn {
    return request(
      undefined,
      arguments[3],
      'zremrangebyrank',
      key,
      start,
      stop
    );
  }

  function zremrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ): MethodReturn {
    return request(undefined, arguments[3], 'zremrangebyscore', key, min, max);
  }

  function zrevrange(
    key: string,
    start: number,
    stop: number,
    options?: { withScores: boolean }
  ): MethodReturn {
    if (options?.withScores) {
      return request(
        arguments[4],
        arguments[5],
        'zrevrange',
        key,
        start,
        stop,
        'WITHSCORES'
      );
    }
    return request(arguments[4], arguments[5], 'zrevrange', key, start, stop);
  }

  function zrevrangebylex(
    key: string,
    max: ZSetNumber,
    min: ZSetNumber,
    offset?: number,
    count?: number
  ): MethodReturn {
    if (offset && count) {
      return request(
        arguments[5],
        arguments[6],
        'zrevrangebylex',
        key,
        max,
        min,
        'LIMIT',
        offset,
        count
      );
    }
    return request(arguments[5], arguments[6], 'zrevrangebylex', key, max, min);
  }

  function zrevrangebyscore(
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ): MethodReturn {
    return request(
      arguments[3],
      arguments[4],
      'zrevrangebyscore',
      key,
      min,
      max
    );
  }

  function zrevrank(key: string, member: string): MethodReturn {
    return request(arguments[2], arguments[3], 'zrevrank', key, member);
  }

  function zscore(key: string, member: string): MethodReturn {
    return request(arguments[2], arguments[3], 'zscore', key, member);
  }

  function zunionstore(
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
  ): MethodReturn {
    if (options) {
      if (options.weights && options.aggregate) {
        return request(
          undefined,
          arguments[3],
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
          undefined,
          arguments[3],
          'zunionstore',
          destination,
          keys.length,
          ...keys,
          'weights',
          ...options.weights
        );
      } else if (options.aggregate) {
        return request(
          undefined,
          arguments[3],
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
      undefined,
      arguments[3],
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
    // HASHES
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
    hscan,
    hset,
    hsetnx,
    hvals,
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
    // LISTS
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
    // SET
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
    // SORTED SETS
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
