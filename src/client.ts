import fetch from 'isomorphic-unfetch';
import {
  ClientObjectProps,
  EdgeCacheType,
  MethodReturn,
  Part,
  RequestConfig,
  ReturnType,
  Upstash,
} from './types';

/**
 * Parse Options
 */
function parseOptions(
  url?: string | ClientObjectProps,
  token?: string,
  edgeUrl?: string,
  readFromEdge?: boolean
): ClientObjectProps {
  if (typeof url === 'object' && url !== null) {
    return parseOptions(url.url, url.token, url.edgeUrl, url.readFromEdge);
  }

  if (!url && typeof window === 'undefined') {
    // try auto fill from env variables
    url = process.env.UPSTASH_REDIS_REST_URL;
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
    edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;
  }

  readFromEdge = edgeUrl ? readFromEdge ?? true : false;

  return edgeUrl ? { url, token, edgeUrl, readFromEdge } : { url, token };
}

/**
 * Fetch
 */
async function fetchData(
  url: string,
  options: ClientObjectProps,
  init: RequestInit
): Promise<ReturnType> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${options.token}`,
        ...init.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error) throw data.error;
      throw `Upstash failed with (${res.status}): ${JSON.stringify(
        data,
        null,
        2
      )}`;
    }

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
  } catch (err) {
    return {
      data: null,
      // @ts-ignore
      error: err,
      metadata: { edge: false, cache: null },
    };
  }
}

/**
 * Request
 */
function request(
  options: ClientObjectProps,
  config: RequestConfig,
  ...parts: Part[]
): MethodReturn {
  if (!options.url) {
    throw 'Database url not found?';
  }

  if (!options.edgeUrl) {
    if (options.readFromEdge || config?.edge) {
      throw 'You need to set Edge Url to read from edge.';
    }
  }

  let fromEdge = !!options.edgeUrl && options.readFromEdge !== false;

  if (config === undefined) {
    fromEdge = false;
  } else if (options.edgeUrl) {
    fromEdge = config?.edge ?? true;
  }

  if (fromEdge) {
    const command = encodeURI(parts.join('/'));
    const edgeUrlWithPath = `${options.edgeUrl!}/${command}`;
    return fetchData(edgeUrlWithPath, options, { method: 'GET' });
  } else {
    return fetchData(options.url!, options, {
      method: 'POST',
      body: JSON.stringify(parts),
    });
  }
}

function hasConfig(options: ClientObjectProps, command: string, a: any) {
  let lastArg;
  let args = [...a];

  if (a.length > 0) {
    lastArg = args.pop();
  }

  if (typeof lastArg === 'object' && lastArg !== null) {
    return request(options, lastArg, command, ...args);
  } else {
    return request(options, {}, command, ...a);
  }
}

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
 * import upstash from '@upstash/redis'
 *
 * const redis1 = upstash('url', token);
 * const redis2 = upstash({ url: '', token: '', edgeUrl: '', readFromEdge: false });
 * ```
 */

function upstash(options?: ClientObjectProps): Upstash;
function upstash(url?: string, token?: string): Upstash;
function upstash(url?: string | ClientObjectProps, token?: string): Upstash {
  const options: ClientObjectProps = parseOptions(url, token);

  /**
   * Auth
   */

  function auth(): void {
    Object.assign(
      options,
      {
        url: undefined,
        token: undefined,
        edgeUrl: undefined,
        readFromEdge: undefined,
      },
      parseOptions(arguments[0], arguments[1])
    );
  }

  /**
   * STRING
   */

  function append() {
    return request(options, undefined, 'append', ...arguments);
  }
  function decr() {
    return request(options, undefined, 'decr', ...arguments);
  }
  function decrby() {
    return request(options, undefined, 'decrby', ...arguments);
  }
  function get() {
    return hasConfig(options, 'get', arguments);
  }
  function getrange() {
    return hasConfig(options, 'getrange', arguments);
  }
  function getset() {
    return request(options, undefined, 'getset', ...arguments);
  }
  function incr() {
    return request(options, undefined, 'incr', ...arguments);
  }
  function incrby() {
    return request(options, undefined, 'incrby', ...arguments);
  }
  function incrbyfloat() {
    return request(options, undefined, 'incrbyfloat', ...arguments);
  }
  function mget() {
    return hasConfig(options, 'mget', arguments);
  }
  function mset() {
    return request(options, undefined, 'mset', ...arguments);
  }
  function msetnx() {
    return request(options, undefined, 'msetnx', ...arguments);
  }
  function psetex() {
    return request(options, undefined, 'psetex', ...arguments);
  }
  function set() {
    return request(options, undefined, 'set', ...arguments);
  }
  function setex() {
    return request(options, undefined, 'setex', ...arguments);
  }
  function setnx() {
    return request(options, undefined, 'setnx', ...arguments);
  }
  function setrange() {
    return request(options, undefined, 'setrange', ...arguments);
  }
  function strlen() {
    return hasConfig(options, 'strlen', arguments);
  }

  /**
   * BITMAPS
   */

  function bitcount() {
    return hasConfig(options, 'bitcount', arguments);
  }
  function bitop() {
    return request(options, undefined, 'bitop', ...arguments);
  }
  function bitpos() {
    return hasConfig(options, 'bitpos', arguments);
  }
  function getbit() {
    return hasConfig(options, 'getbit', arguments);
  }
  function setbit() {
    return request(options, undefined, 'setbit', ...arguments);
  }

  /**
   * CONNECTION
   */

  function echo() {
    return hasConfig(options, 'echo', arguments);
  }
  function ping() {
    return hasConfig(options, 'ping', arguments);
  }

  /**
   * HASHES
   */

  function hdel(): MethodReturn {
    return request(options, undefined, 'hdel', ...arguments);
  }
  function hexists(): MethodReturn {
    return hasConfig(options, 'hexists', arguments);
  }
  function hget(): MethodReturn {
    return hasConfig(options, 'hget', arguments);
  }
  function hgetall(): MethodReturn {
    return hasConfig(options, 'hgetall', arguments);
  }
  function hincrby(): MethodReturn {
    return request(options, undefined, 'hincrby', ...arguments);
  }
  function hincrbyfloat(): MethodReturn {
    return request(options, undefined, 'hincrbyfloat', ...arguments);
  }
  function hkeys(): MethodReturn {
    return hasConfig(options, 'hkeys', arguments);
  }
  function hlen(): MethodReturn {
    return hasConfig(options, 'hlen', arguments);
  }
  function hmget(): MethodReturn {
    return hasConfig(options, 'hmget', arguments);
  }
  function hmset(): MethodReturn {
    return request(options, undefined, 'hmset', ...arguments);
  }
  function hscan(): MethodReturn {
    return request(options, undefined, 'hscan', ...arguments);
  }
  function hset(): MethodReturn {
    return request(options, undefined, 'hset', ...arguments);
  }
  function hsetnx(): MethodReturn {
    return request(options, undefined, 'hsetnx', ...arguments);
  }
  function hvals(): MethodReturn {
    return hasConfig(options, 'hvals', arguments);
  }

  /**
   * KEYS
   */

  function del(): MethodReturn {
    return request(options, undefined, 'del', ...arguments);
  }
  function exists(): MethodReturn {
    return hasConfig(options, 'exists', arguments);
  }
  function expire(): MethodReturn {
    return request(options, undefined, 'expire', ...arguments);
  }
  function expireat(): MethodReturn {
    return request(options, undefined, 'expireat', ...arguments);
  }
  function keys(): MethodReturn {
    return hasConfig(options, 'keys', arguments);
  }
  function persist(): MethodReturn {
    return request(options, undefined, 'persist', ...arguments);
  }
  function pexpire(): MethodReturn {
    return request(options, undefined, 'pexpire', ...arguments);
  }
  function pexpireat(): MethodReturn {
    return request(options, undefined, 'pexpireat', ...arguments);
  }
  function pttl(): MethodReturn {
    return hasConfig(options, 'pttl', arguments);
  }
  function randomkey(): MethodReturn {
    return request(options, undefined, 'randomkey', ...arguments);
  }
  function rename(): MethodReturn {
    return request(options, undefined, 'rename', ...arguments);
  }
  function renamenx(): MethodReturn {
    return request(options, undefined, 'renamenx', ...arguments);
  }
  function scan(): MethodReturn {
    return request(options, undefined, 'scan', ...arguments);
  }
  function touch(): MethodReturn {
    return request(options, undefined, 'touch', ...arguments);
  }
  function ttl(): MethodReturn {
    return hasConfig(options, 'ttl', arguments);
  }
  function type(): MethodReturn {
    return hasConfig(options, 'type', arguments);
  }
  function unlink(): MethodReturn {
    return request(options, undefined, 'unlink', ...arguments);
  }

  /**
   * LISTS
   */

  function lindex(): MethodReturn {
    return hasConfig(options, 'lindex', arguments);
  }
  function linsert(): MethodReturn {
    return request(options, undefined, 'linsert', ...arguments);
  }
  function llen(): MethodReturn {
    return hasConfig(options, 'llen', arguments);
  }
  function lpop(): MethodReturn {
    return request(options, undefined, 'lpop', ...arguments);
  }
  function lpush(): MethodReturn {
    return request(options, undefined, 'lpush', ...arguments);
  }
  function lpushx(): MethodReturn {
    return request(options, undefined, 'lpushx', ...arguments);
  }
  function lrange(): MethodReturn {
    return hasConfig(options, 'lrange', arguments);
  }
  function lrem(): MethodReturn {
    return request(options, undefined, 'lrem', ...arguments);
  }
  function lset(): MethodReturn {
    return request(options, undefined, 'lset', ...arguments);
  }
  function ltrim(): MethodReturn {
    return request(options, undefined, 'ltrim', ...arguments);
  }
  function rpop(): MethodReturn {
    return request(options, undefined, 'rpop', ...arguments);
  }
  function rpoplpush(): MethodReturn {
    return request(options, undefined, 'rpoplpush', ...arguments);
  }
  function rpush(): MethodReturn {
    return request(options, undefined, 'rpush', ...arguments);
  }
  function rpushx(): MethodReturn {
    return request(options, undefined, 'rpushx', ...arguments);
  }

  /**
   * SERVER
   */

  function dbsize(): MethodReturn {
    return hasConfig(options, 'dbsize', arguments);
  }
  function flushall(): MethodReturn {
    return request(options, undefined, 'flushall', ...arguments);
  }
  function flushdb(): MethodReturn {
    return request(options, undefined, 'flushdb', ...arguments);
  }
  function info(): MethodReturn {
    return hasConfig(options, 'info', arguments);
  }
  function time(): MethodReturn {
    return request(options, undefined, 'time', ...arguments);
  }

  /**
   * SET
   */

  function sadd(): MethodReturn {
    return request(options, undefined, 'sadd', ...arguments);
  }
  function scard(): MethodReturn {
    return request(options, undefined, 'scard', ...arguments);
  }
  function sdiff(): MethodReturn {
    return hasConfig(options, 'sdiff', arguments);
  }
  function sdiffstore(): MethodReturn {
    return request(options, undefined, 'sdiffstore', ...arguments);
  }
  function sinter(): MethodReturn {
    return hasConfig(options, 'sinter', arguments);
  }
  function sinterstore(): MethodReturn {
    return request(options, undefined, 'sinterstore', ...arguments);
  }
  function sismember(): MethodReturn {
    return hasConfig(options, 'sismember', arguments);
  }
  function smembers(): MethodReturn {
    return hasConfig(options, 'smembers', arguments);
  }
  function smove(): MethodReturn {
    return request(options, undefined, 'smove', ...arguments);
  }
  function spop(): MethodReturn {
    return request(options, undefined, 'spop', ...arguments);
  }
  function srandmember(): MethodReturn {
    return hasConfig(options, 'srandmember', arguments);
  }
  function srem(): MethodReturn {
    return request(options, undefined, 'srem', ...arguments);
  }
  function sunion(): MethodReturn {
    return hasConfig(options, 'sunion', arguments);
  }
  function sunionstore(): MethodReturn {
    return request(options, undefined, 'sunionstore', ...arguments);
  }

  /**
   * SORTED SETS
   */

  function zadd(): MethodReturn {
    return request(options, undefined, 'zadd', ...arguments);
  }
  function zcard(): MethodReturn {
    return hasConfig(options, 'zcard', arguments);
  }
  function zcount(): MethodReturn {
    return hasConfig(options, 'zcount', arguments);
  }
  function zincrby(): MethodReturn {
    return request(options, undefined, 'zincrby', ...arguments);
  }
  function zinterstore(): MethodReturn {
    return request(options, undefined, 'zinterstore', ...arguments);
  }
  function zlexcount(): MethodReturn {
    return hasConfig(options, 'zlexcount', arguments);
  }
  function zpopmax(): MethodReturn {
    return request(options, undefined, 'zpopmax', ...arguments);
  }
  function zpopmin(): MethodReturn {
    return request(options, undefined, 'zpopmin', ...arguments);
  }
  function zrange(): MethodReturn {
    return hasConfig(options, 'zrange', arguments);
  }
  function zrangebylex(): MethodReturn {
    return hasConfig(options, 'zrangebylex', arguments);
  }
  function zrangebyscore(): MethodReturn {
    return hasConfig(options, 'zrangebyscore', arguments);
  }
  function zrank(): MethodReturn {
    return hasConfig(options, 'zrank', arguments);
  }
  function zrem(): MethodReturn {
    return request(options, undefined, 'zrem', ...arguments);
  }
  function zremrangebylex(): MethodReturn {
    return request(options, undefined, 'zremrangebylex', ...arguments);
  }
  function zremrangebyrank(): MethodReturn {
    return request(options, undefined, 'zremrangebyrank', ...arguments);
  }
  function zremrangebyscore(): MethodReturn {
    return request(options, undefined, 'zremrangebyscore', ...arguments);
  }
  function zrevrange(): MethodReturn {
    return hasConfig(options, 'zrevrange', arguments);
  }
  function zrevrangebylex(): MethodReturn {
    return hasConfig(options, 'zrevrangebylex', arguments);
  }
  function zrevrangebyscore(): MethodReturn {
    return hasConfig(options, 'zrevrangebyscore', arguments);
  }
  function zrevrank(): MethodReturn {
    return hasConfig(options, 'zrevrank', arguments);
  }
  function zscore(): MethodReturn {
    return hasConfig(options, 'zscore', arguments);
  }
  function zunionstore(): MethodReturn {
    return request(options, undefined, 'zunionstore', ...arguments);
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

export default upstash;
