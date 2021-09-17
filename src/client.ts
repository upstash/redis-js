import fetch from 'isomorphic-unfetch';

export type ReturnType = {
  data: null | string | number | [];
  error: null | string;
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

  // APPEND
  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'append', key, value);
  }

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
    sourceKeys: string | string[],
    callback?: Callback
  ): MethodReturn {
    if (Array.isArray(sourceKeys)) {
      return request(
        callback,
        'bitop',
        operation,
        destinationKey,
        ...sourceKeys
      );
    }
    return request(callback, 'bitop', operation, destinationKey, sourceKeys);
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

  // DBSIZE
  function dbsize(callback?: Callback): MethodReturn {
    return request(callback, 'dbsize');
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

  // DEL
  function del(
    key: string,
    fields: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'del', key, ...fields);
  }

  // TODO:EVAL
  // TODO:EVALSHA

  // EXISTS
  function exists(key: string | string[], callback?: Callback): MethodReturn {
    if (Array.isArray(key)) {
      return request(callback, 'exists', ...key);
    }
    return request(callback, 'exists', key);
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

  // GET
  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  // TODO:GETBIT
  // TODO:GETRANGE
  // TODO:GETSET
  // TODO:HDEL
  // TODO:HEXISTS
  // TODO:HGET
  // TODO:HGETALL
  // TODO:HINCRBY
  // TODO:HINCRBYFLOAT
  // TODO:HKEYS
  // TODO:HLEN
  // TODO:HMGET
  // TODO:HSCAN
  // TODO:HSET
  // TODO:HSETNX
  // TODO:HVALS
  // TODO:INCR
  // TODO:INCRBY
  // TODO:INCRBYFLOAT

  // KEYS
  function keys(pattern: string, callback?: Callback): MethodReturn {
    return request(callback, 'keys', pattern);
  }

  // TODO:LINDEX
  // TODO:LINSERT
  // TODO:LLEN
  // TODO:LPOP
  // TODO:LPUSH
  // TODO:LPUSHX
  // TODO:LRANGE
  // TODO:LREM
  // TODO:LSET
  // TODO:LTRIM
  // TODO:MGET

  // MSET
  function mset(values: string[], callback?: Callback): MethodReturn {
    return request(callback, 'mset', ...values);
  }

  // TODO:MSETNX
  // TODO:PEXPIRE
  // TODO:PING
  // TODO:PSETEX
  // TODO:PTTL
  // TODO:RANDOMKEY
  // TODO:RENAME
  // TODO:RENAMENX
  // TODO:RPOP
  // TODO:RPOPLPUSH
  // TODO:RPUSH
  // TODO:RPUSHX
  // TODO:SADD
  // TODO:SCAN
  // TODO:SCARD
  // TODO:SCRIPT EXISTS
  // TODO:SCRIPT FLUSH
  // TODO:SCRIPT LOAD
  // TODO:SDIFF
  // TODO:SDIFFSTORE

  // SET
  function set(key: string, value: string, callback?: Callback): MethodReturn {
    return request(callback, 'set', key, value);
  }

  // TODO:SETBIT
  // TODO:SETEX
  // TODO:SETNX
  // TODO:SETRANGE
  // TODO:SINTER
  // TODO:SINTERSTORE
  // TODO:SISMEMBER
  // TODO:SMEMBERS
  // TODO:SMOVE
  // TODO:SPOP
  // TODO:SRANDMEMBER
  // TODO:SREM
  // TODO:SSCAN
  // TODO:STRLEN
  // TODO:SUNION
  // TODO:SUNIONSTORE
  // TODO:TOUCH

  // TTL
  function ttl(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'ttl', key);
  }

  // TODO:TYPE
  // TODO:ZADD
  // TODO:ZCARD
  // TODO:ZCOUNT
  // TODO:ZINCRBY
  // TODO:ZINTERSTORE
  // TODO:ZLEXCOUNT
  // TODO:ZPOPMAX
  // TODO:ZPOPMIN
  // TODO:ZRANGE
  // TODO:ZRANGEBYLEX
  // TODO:ZRANGEBYSCORE
  // TODO:ZRANK
  // TODO:ZREM
  // TODO:ZREMRANGEBYLEX
  // TODO:ZREMRANGEBYRANK
  // TODO:ZREMRANGEBYSCORE
  // TODO:ZREVRANGE
  // TODO:ZREVRANGEBYLEX
  // TODO:ZREVRANGEBYSCORE
  // TODO:ZREVRANK
  // TODO:ZSCAN
  // TODO:ZSCORE
  // TODO:ZUNIONSTORE

  return {
    auth,
    append,
    bitcount,
    bitop,
    bitpos,
    dbsize,
    decr,
    decrby,
    del,
    exists,
    expire,
    flushall,
    flushdb,
    get,
    keys,
    mset,
    set,
    ttl,
  };
}
