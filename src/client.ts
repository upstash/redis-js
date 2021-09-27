import fetch from 'isomorphic-unfetch';

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
};
type MethodReturn = Promise<ReturnType>;
type Callback = (res: ReturnType) => any;
type Part = string | boolean | number;
type Bit = 0 | 1;

/**
 * Upstash client
 * @param {string} url - database rest url
 * @param {string} token - database rest token
 */
export default function client(url?: string, token?: string) {
  let baseURL: string = url ?? process.env.UPSTASH_URL ?? '';
  let authToken: string = token ?? process.env.UPSTASH_TOKEN ?? '';

  async function auth(url: string, token: string) {
    baseURL = url;
    authToken = token;
  }

  /**
   * Request
   * @param {function} callback - callback
   * @param {Object} parts - command, key, values, ...
   */
  function request(callback?: Callback, ...parts: Part[]): MethodReturn {
    const promise: Promise<ReturnType> = new Promise((resolve, reject) => {
      return fetch(baseURL, {
        method: 'POST',
        body: JSON.stringify(parts),
        headers: {
          Authorization: `Bearer ${authToken}`,
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
            error,
          });
        });
    });

    if (callback) {
      return promise.then(callback);
    }

    return promise;
  }

  /*
  ------------------------------------------------
  STRING
  ------------------------------------------------
   */

  // APPEND
  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'append', key, value);
  }

  // DECR
  function decr(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'decr', key);
  }

  // DECRBY
  function decrby(
    key: string,
    decrement: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'decrby', key, decrement);
  }

  // GET
  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  // GETRANGE
  function getrange(
    key: string,
    start: number,
    end: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getrange', key, start, end);
  }

  // GETSET
  function getset(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getset', key, value);
  }

  // INCR
  function incr(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'incr', key);
  }

  // INCRBY
  function incrby(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'incrby', key, value);
  }

  // INCRBYFLOAT
  function incrbyfloat(
    key: string,
    value: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'incrbyfloat', key, value);
  }

  // MGET
  function mget(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'mget', ...values);
  }

  // MSET
  function mset(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'mset', ...values);
  }

  // MSETNX
  function msetnx(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'msetnx', ...values);
  }

  // PSETEX
  function psetex(
    key: string,
    miliseconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'psetex', key, miliseconds, value);
  }

  // SET
  function set(
    key: string,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'set', key, value);
  }

  // SETEX
  function setex(
    key: string,
    seconds: number,
    value: string | number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setex', key, seconds, value);
  }

  // SETNX
  function setnx(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setnx', key, value);
  }

  // SETRANGE
  function setrange(
    key: string,
    offset: number | string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setrange', key, offset, value);
  }

  // STRLEN
  function strlen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'strlen', key);
  }

  /*
  ------------------------------------------------
  BITMAPS
  ------------------------------------------------
   */

  // BITCOUNT
  function bitcount(
    key: string,
    start?: number,
    end?: number,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(callback, 'bitcount', key, start, end);
    }
    return request(callback, 'bitcount', key);
  }

  // BITOP
  function bitop(
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destinationKey: string,
    sourceKeys: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'bitop', operation, destinationKey, ...sourceKeys);
  }

  // BITPOS
  function bitpos(
    key: string,
    bit: Bit,
    start?: number,
    end?: number,
    callback?: Callback
  ): MethodReturn {
    if (start !== undefined && end !== undefined) {
      return request(callback, 'bitpos', key, bit, start, end);
    } else if (start !== undefined) {
      return request(callback, 'bitpos', key, bit, start);
    }
    return request(callback, 'bitpos', key, bit);
  }

  // GETBIT
  function getbit(
    key: string,
    offset: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'getbit', key, offset);
  }

  // SETBIT
  function setbit(
    key: string,
    offset: number,
    value: Bit,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'setbit', key, offset, value);
  }

  /*
  ------------------------------------------------
  CONNECTION
  ------------------------------------------------
   */

  // ECHO
  function echo(value: string, callback?: Callback): MethodReturn {
    return request(callback, 'echo', value);
  }

  // PING
  function ping(value?: string, callback?: Callback): MethodReturn {
    if (value) {
      return request(callback, 'ping', value);
    }
    return request(callback, 'ping');
  }

  /*
  ------------------------------------------------
  HASHES
  ------------------------------------------------
   */

  // HDEL
  function hdel(
    key: string,
    field: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hdel', key, ...field);
  }

  // HEXISTS
  function hexists(
    key: string,
    field: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hexists', key, field);
  }

  // HGET
  function hget(key: string, field: string, callback?: Callback): MethodReturn {
    return request(callback, 'hget', key, field);
  }

  // HGETALL
  function hgetall(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hgetall', key);
  }

  // HINCRBY
  function hincrby(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hincrby', key, field, increment);
  }

  // HINCRBYFLOAT
  function hincrbyfloat(
    key: string,
    field: string,
    increment: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hincrbyfloat', key, field, increment);
  }

  // HKEYS
  function hkeys(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hkeys', key);
  }

  // HLEN
  function hlen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hlen', key);
  }

  // HMGET
  function hmget(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hmget', key);
  }

  // HMSET
  function hmset(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hmset', key);
  }

  // HSET
  function hset(
    key: string,
    values: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'hset', key, ...values);
  }

  // HSETNX
  function hsetnx(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hsetnx', key);
  }

  // HVALS
  function hvals(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hvals', key);
  }

  // HSCAN
  function hscan(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'hscan', key);
  }

  /*
  ------------------------------------------------
  KEYS
  ------------------------------------------------
   */

  // DEL
  function del(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'del', ...keys);
  }

  // EXISTS
  function exists(key: string[], callback?: Callback): MethodReturn {
    return request(callback, 'exists', ...key);
  }

  // EXPIRE
  function expire(
    key: string,
    seconds: number,
    option?: 'NX' | 'XX' | 'GT' | 'LT',
    callback?: Callback
  ): MethodReturn {
    if (option) {
      return request(callback, 'expire', key, seconds, option);
    }
    return request(callback, 'expire', key, seconds);
  }

  // EXPIREAT
  function expireat(
    key: string,
    timestamp: number | string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'expireat', key, timestamp);
  }

  // KEYS
  function keys(pattern: string, callback?: Callback): MethodReturn {
    return request(callback, 'keys', pattern);
  }

  // PERSIST
  function persist(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'persist', key);
  }

  // PEXPIRE
  function pexpire(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'pexpire', key, miliseconds);
  }

  // PEXPIREAT
  function pexpireat(
    key: string,
    miliseconds: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'pexpireat', key, miliseconds);
  }

  // PTTL
  function pttl(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'pttl', key);
  }

  // RANDOMKEY
  function randomkey(callback?: Callback): MethodReturn {
    return request(callback, 'randomkey');
  }

  // RENAME
  function rename(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rename', key, newkey);
  }

  // RENAMENX
  function renamenx(
    key: string,
    newkey: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'renamenx', key, newkey);
  }

  // SCAN
  function scan(
    cursor: number | string,
    opts?: { match?: number | string; count?: number | string },
    callback?: Callback
  ): MethodReturn {
    if (opts?.match && opts?.count) {
      return request(
        callback,
        'scan',
        cursor,
        'match',
        opts.match,
        'count',
        opts.count
      );
    } else if (opts?.match) {
      return request(callback, 'scan', cursor, 'match', opts.match);
    } else if (opts?.count) {
      return request(callback, 'scan', cursor, 'count', opts.count);
    }
    return request(callback, 'scan', cursor);
  }

  // TOUCH
  function touch(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'touch', ...keys);
  }

  // TTL
  function ttl(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'ttl', key);
  }

  // TYPE
  function type(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'type', key);
  }

  // UNLINK
  function unlink(keys: string[], callback?: Callback): MethodReturn {
    return request(callback, 'unlink', ...keys);
  }

  /*
  ------------------------------------------------
  LISTS
  ------------------------------------------------
   */

  // LINDEX
  function lindex(
    key: string,
    index: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lindex', key, index);
  }

  // LINSERT
  function linsert(
    key: string,
    opt: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'linsert', key, opt, pivot, element);
  }

  // LLEN
  function llen(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'llen', key);
  }

  // LPOP
  function lpop(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'lpop', key);
  }

  // LPUSH
  function lpush(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lpush', key, ...element);
  }

  // LPUSHX
  function lpushx(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lpushx', key, ...element);
  }

  // LRANGE
  function lrange(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lrange', key, start, stop);
  }

  // LREM
  function lrem(
    key: string,
    count: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lrem', key, count, element);
  }

  // LSET
  function lset(
    key: string,
    index: number,
    element: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'lset', key, index, element);
  }

  // LTRIM
  function ltrim(
    key: string,
    start: number,
    stop: number,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'ltrim', key, start, stop);
  }

  // RPOP
  function rpop(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'rpop', key);
  }

  // RPOPLPUSH
  function rpoplpush(
    source: string,
    destination: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpoplpush', source, destination);
  }

  // RPUSH
  function rpush(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpush', key, ...element);
  }

  // RPUSHX
  function rpushx(
    key: string,
    element: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'rpushx', key, ...element);
  }
  /*
  ------------------------------------------------
  SERVER
  ------------------------------------------------
   */

  // DBSIZE
  function dbsize(callback?: Callback): MethodReturn {
    return request(callback, 'dbsize');
  }

  // FLUSHALL
  function flushall(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request(callback, 'flushall', mode);
    }
    return request(callback, 'flushall');
  }

  // FLUSHDB
  function flushdb(mode?: 'ASYNC', callback?: Callback): MethodReturn {
    if (mode) {
      return request(callback, 'flushdb', mode);
    }
    return request(callback, 'flushdb');
  }

  // INFO
  function info(callback?: Callback): MethodReturn {
    return request(callback, 'info');
  }

  // PING
  function time(callback?: Callback): MethodReturn {
    return request(callback, 'time');
  }

  /*
  ------------------------------------------------
  SET
  ------------------------------------------------
   */

  /*
  ------------------------------------------------
  SORTED SETS
  ------------------------------------------------
   */

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
  };
}
