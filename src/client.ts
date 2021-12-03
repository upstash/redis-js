import fetch from 'isomorphic-unfetch';
import {
  ClientObjectProps,
  MethodReturn,
  Part,
  ReturnType,
  Upstash,
} from './types';

/**
 * Parse Options
 */
function parseOptions(
  url?: string | ClientObjectProps,
  token?: string,
  requestOptions: undefined | RequestInit = {}
): ClientObjectProps {
  if (typeof url === 'object' && url !== null) {
    return parseOptions(url.url, url.token, url.requestOptions);
  }

  // try auto fill from env variables
  if (!url && typeof window === 'undefined') {
    url = process.env.UPSTASH_REDIS_REST_URL;
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  return { url: url as string, token, requestOptions };
}

/**
 * Fetch
 */
async function fetchData(
  options: ClientObjectProps,
  ...parts: Part[]
): Promise<ReturnType> {
  if (!options.url) {
    throw 'Database url not found?';
  }

  try {
    const res = await fetch(options.url!, {
      method: 'POST',
      body: JSON.stringify(parts),
      headers: {
        Authorization: `Bearer ${options.token}`,
        ...options.requestOptions?.headers,
      },
      ...options.requestOptions,
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

    return {
      data: data.result,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      // @ts-ignore
      error: err,
    };
  }
}

/**
 * Creates a Upstash Redis instance
 *
 * @constructor
 * @param {Object} options
 * @param {string} [options.url]
 * @param {string} [options.token]
 * @param {Object} [options.requestOptions]
 *
 * @example
 * ```js
 * import upstash from '@upstash/redis'
 *
 * const redis1 = upstash('url', token);
 * const redis2 = upstash({ url: '', token: '', requestOptions: {} });
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
      },
      parseOptions(arguments[0], arguments[1])
    );
  }

  /**
   * STRING
   */

  function append() {
    return fetchData(options, 'append', ...arguments);
  }
  function decr() {
    return fetchData(options, 'decr', ...arguments);
  }
  function decrby() {
    return fetchData(options, 'decrby', ...arguments);
  }
  function get() {
    return fetchData(options, 'get', ...arguments);
  }
  function getrange() {
    return fetchData(options, 'getrange', ...arguments);
  }
  function getset() {
    return fetchData(options, 'getset', ...arguments);
  }
  function incr() {
    return fetchData(options, 'incr', ...arguments);
  }
  function incrby() {
    return fetchData(options, 'incrby', ...arguments);
  }
  function incrbyfloat() {
    return fetchData(options, 'incrbyfloat', ...arguments);
  }
  function mget() {
    return fetchData(options, 'mget', ...arguments);
  }
  function mset() {
    return fetchData(options, 'mset', ...arguments);
  }
  function msetnx() {
    return fetchData(options, 'msetnx', ...arguments);
  }
  function psetex() {
    return fetchData(options, 'psetex', ...arguments);
  }
  function set() {
    return fetchData(options, 'set', ...arguments);
  }
  function setex() {
    return fetchData(options, 'setex', ...arguments);
  }
  function setnx() {
    return fetchData(options, 'setnx', ...arguments);
  }
  function setrange() {
    return fetchData(options, 'setrange', ...arguments);
  }
  function strlen() {
    return fetchData(options, 'strlen', ...arguments);
  }

  /**
   * BITMAPS
   */

  function bitcount() {
    return fetchData(options, 'bitcount', ...arguments);
  }
  function bitop() {
    return fetchData(options, 'bitop', ...arguments);
  }
  function bitpos() {
    return fetchData(options, 'bitpos', ...arguments);
  }
  function getbit() {
    return fetchData(options, 'getbit', ...arguments);
  }
  function setbit() {
    return fetchData(options, 'setbit', ...arguments);
  }

  /**
   * CONNECTION
   */

  function echo() {
    return fetchData(options, 'echo', ...arguments);
  }
  function ping() {
    return fetchData(options, 'ping', ...arguments);
  }

  /**
   * HASHES
   */

  function hdel(): MethodReturn {
    return fetchData(options, 'hdel', ...arguments);
  }
  function hexists(): MethodReturn {
    return fetchData(options, 'hexists', ...arguments);
  }
  function hget(): MethodReturn {
    return fetchData(options, 'hget', ...arguments);
  }
  function hgetall(): MethodReturn {
    return fetchData(options, 'hgetall', ...arguments);
  }
  function hincrby(): MethodReturn {
    return fetchData(options, 'hincrby', ...arguments);
  }
  function hincrbyfloat(): MethodReturn {
    return fetchData(options, 'hincrbyfloat', ...arguments);
  }
  function hkeys(): MethodReturn {
    return fetchData(options, 'hkeys', ...arguments);
  }
  function hlen(): MethodReturn {
    return fetchData(options, 'hlen', ...arguments);
  }
  function hmget(): MethodReturn {
    return fetchData(options, 'hmget', ...arguments);
  }
  function hmset(): MethodReturn {
    return fetchData(options, 'hmset', ...arguments);
  }
  function hscan(): MethodReturn {
    return fetchData(options, 'hscan', ...arguments);
  }
  function hset(): MethodReturn {
    return fetchData(options, 'hset', ...arguments);
  }
  function hsetnx(): MethodReturn {
    return fetchData(options, 'hsetnx', ...arguments);
  }
  function hvals(): MethodReturn {
    return fetchData(options, 'hvals', ...arguments);
  }

  /**
   * KEYS
   */

  function del(): MethodReturn {
    return fetchData(options, 'del', ...arguments);
  }
  function exists(): MethodReturn {
    return fetchData(options, 'exists', ...arguments);
  }
  function expire(): MethodReturn {
    return fetchData(options, 'expire', ...arguments);
  }
  function expireat(): MethodReturn {
    return fetchData(options, 'expireat', ...arguments);
  }
  function keys(): MethodReturn {
    return fetchData(options, 'keys', ...arguments);
  }
  function persist(): MethodReturn {
    return fetchData(options, 'persist', ...arguments);
  }
  function pexpire(): MethodReturn {
    return fetchData(options, 'pexpire', ...arguments);
  }
  function pexpireat(): MethodReturn {
    return fetchData(options, 'pexpireat', ...arguments);
  }
  function pttl(): MethodReturn {
    return fetchData(options, 'pttl', ...arguments);
  }
  function randomkey(): MethodReturn {
    return fetchData(options, 'randomkey', ...arguments);
  }
  function rename(): MethodReturn {
    return fetchData(options, 'rename', ...arguments);
  }
  function renamenx(): MethodReturn {
    return fetchData(options, 'renamenx', ...arguments);
  }
  function scan(): MethodReturn {
    return fetchData(options, 'scan', ...arguments);
  }
  function touch(): MethodReturn {
    return fetchData(options, 'touch', ...arguments);
  }
  function ttl(): MethodReturn {
    return fetchData(options, 'ttl', ...arguments);
  }
  function type(): MethodReturn {
    return fetchData(options, 'type', ...arguments);
  }
  function unlink(): MethodReturn {
    return fetchData(options, 'unlink', ...arguments);
  }

  /**
   * LISTS
   */

  function lindex(): MethodReturn {
    return fetchData(options, 'lindex', ...arguments);
  }
  function linsert(): MethodReturn {
    return fetchData(options, 'linsert', ...arguments);
  }
  function llen(): MethodReturn {
    return fetchData(options, 'llen', ...arguments);
  }
  function lpop(): MethodReturn {
    return fetchData(options, 'lpop', ...arguments);
  }
  function lpush(): MethodReturn {
    return fetchData(options, 'lpush', ...arguments);
  }
  function lpushx(): MethodReturn {
    return fetchData(options, 'lpushx', ...arguments);
  }
  function lrange(): MethodReturn {
    return fetchData(options, 'lrange', ...arguments);
  }
  function lrem(): MethodReturn {
    return fetchData(options, 'lrem', ...arguments);
  }
  function lset(): MethodReturn {
    return fetchData(options, 'lset', ...arguments);
  }
  function ltrim(): MethodReturn {
    return fetchData(options, 'ltrim', ...arguments);
  }
  function rpop(): MethodReturn {
    return fetchData(options, 'rpop', ...arguments);
  }
  function rpoplpush(): MethodReturn {
    return fetchData(options, 'rpoplpush', ...arguments);
  }
  function rpush(): MethodReturn {
    return fetchData(options, 'rpush', ...arguments);
  }
  function rpushx(): MethodReturn {
    return fetchData(options, 'rpushx', ...arguments);
  }

  /**
   * SERVER
   */

  function dbsize(): MethodReturn {
    return fetchData(options, 'dbsize', ...arguments);
  }
  function flushall(): MethodReturn {
    return fetchData(options, 'flushall', ...arguments);
  }
  function flushdb(): MethodReturn {
    return fetchData(options, 'flushdb', ...arguments);
  }
  function info(): MethodReturn {
    return fetchData(options, 'info', ...arguments);
  }
  function time(): MethodReturn {
    return fetchData(options, 'time', ...arguments);
  }

  /**
   * SET
   */

  function sadd(): MethodReturn {
    return fetchData(options, 'sadd', ...arguments);
  }
  function scard(): MethodReturn {
    return fetchData(options, 'scard', ...arguments);
  }
  function sdiff(): MethodReturn {
    return fetchData(options, 'sdiff', ...arguments);
  }
  function sdiffstore(): MethodReturn {
    return fetchData(options, 'sdiffstore', ...arguments);
  }
  function sinter(): MethodReturn {
    return fetchData(options, 'sinter', ...arguments);
  }
  function sinterstore(): MethodReturn {
    return fetchData(options, 'sinterstore', ...arguments);
  }
  function sismember(): MethodReturn {
    return fetchData(options, 'sismember', ...arguments);
  }
  function smembers(): MethodReturn {
    return fetchData(options, 'smembers', ...arguments);
  }
  function smove(): MethodReturn {
    return fetchData(options, 'smove', ...arguments);
  }
  function spop(): MethodReturn {
    return fetchData(options, 'spop', ...arguments);
  }
  function srandmember(): MethodReturn {
    return fetchData(options, 'srandmember', ...arguments);
  }
  function srem(): MethodReturn {
    return fetchData(options, 'srem', ...arguments);
  }
  function sunion(): MethodReturn {
    return fetchData(options, 'sunion', ...arguments);
  }
  function sunionstore(): MethodReturn {
    return fetchData(options, 'sunionstore', ...arguments);
  }

  /**
   * SORTED SETS
   */

  function zadd(): MethodReturn {
    return fetchData(options, 'zadd', ...arguments);
  }
  function zcard(): MethodReturn {
    return fetchData(options, 'zcard', ...arguments);
  }
  function zcount(): MethodReturn {
    return fetchData(options, 'zcount', ...arguments);
  }
  function zincrby(): MethodReturn {
    return fetchData(options, 'zincrby', ...arguments);
  }
  function zinterstore(): MethodReturn {
    return fetchData(options, 'zinterstore', ...arguments);
  }
  function zlexcount(): MethodReturn {
    return fetchData(options, 'zlexcount', ...arguments);
  }
  function zpopmax(): MethodReturn {
    return fetchData(options, 'zpopmax', ...arguments);
  }
  function zpopmin(): MethodReturn {
    return fetchData(options, 'zpopmin', ...arguments);
  }
  function zrange(): MethodReturn {
    return fetchData(options, 'zrange', ...arguments);
  }
  function zrangebylex(): MethodReturn {
    return fetchData(options, 'zrangebylex', ...arguments);
  }
  function zrangebyscore(): MethodReturn {
    return fetchData(options, 'zrangebyscore', ...arguments);
  }
  function zrank(): MethodReturn {
    return fetchData(options, 'zrank', ...arguments);
  }
  function zrem(): MethodReturn {
    return fetchData(options, 'zrem', ...arguments);
  }
  function zremrangebylex(): MethodReturn {
    return fetchData(options, 'zremrangebylex', ...arguments);
  }
  function zremrangebyrank(): MethodReturn {
    return fetchData(options, 'zremrangebyrank', ...arguments);
  }
  function zremrangebyscore(): MethodReturn {
    return fetchData(options, 'zremrangebyscore', ...arguments);
  }
  function zrevrange(): MethodReturn {
    return fetchData(options, 'zrevrange', ...arguments);
  }
  function zrevrangebylex(): MethodReturn {
    return fetchData(options, 'zrevrangebylex', ...arguments);
  }
  function zrevrangebyscore(): MethodReturn {
    return fetchData(options, 'zrevrangebyscore', ...arguments);
  }
  function zrevrank(): MethodReturn {
    return fetchData(options, 'zrevrank', ...arguments);
  }
  function zscore(): MethodReturn {
    return fetchData(options, 'zscore', ...arguments);
  }
  function zunionstore(): MethodReturn {
    return fetchData(options, 'zunionstore', ...arguments);
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
