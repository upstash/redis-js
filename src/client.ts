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

  function del(
    key: string,
    fields: string[],
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'del', key, ...fields);
  }

  // DEL
  // EVAL
  // EVALSHA
  // EXISTS
  // EXPIRE
  // FLUSHALL
  // FLUSHDB

  // GET
  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  // GETBIT
  // GETRANGE
  // GETSET
  // HDEL
  // HEXISTS
  // HGET
  // HGETALL
  // HINCRBY
  // HINCRBYFLOAT
  // HKEYS
  // HLEN
  // HMGET
  // HSCAN
  // HSET
  // HSETNX
  // HVALS
  // INCR
  // INCRBY
  // INCRBYFLOAT
  // KEYS
  // LINDEX
  // LINSERT
  // LLEN
  // LPOP
  // LPUSH
  // LPUSHX
  // LRANGE
  // LREM
  // LSET
  // LTRIM
  // MGET
  // MSET
  // MSETNX
  // PEXPIRE
  // PING
  // PSETEX
  // PTTL
  // RANDOMKEY
  // RENAME
  // RENAMENX
  // RPOP
  // RPOPLPUSH
  // RPUSH
  // RPUSHX
  // SADD
  // SCAN
  // SCARD
  // SCRIPT EXISTS
  // SCRIPT FLUSH
  // SCRIPT LOAD
  // SDIFF
  // SDIFFSTORE

  // SET
  function set(key: string, value: string, callback?: Callback): MethodReturn {
    return request(callback, 'set', key, value);
  }

  // SETBIT
  // SETEX
  // SETNX
  // SETRANGE
  // SINTER
  // SINTERSTORE
  // SISMEMBER
  // SMEMBERS
  // SMOVE
  // SPOP
  // SRANDMEMBER
  // SREM
  // SSCAN
  // STRLEN
  // SUNION
  // SUNIONSTORE
  // TOUCH
  // TTL
  // TYPE
  // ZADD
  // ZCARD
  // ZCOUNT
  // ZINCRBY
  // ZINTERSTORE
  // ZLEXCOUNT
  // ZPOPMAX
  // ZPOPMIN
  // ZRANGE
  // ZRANGEBYLEX
  // ZRANGEBYSCORE
  // ZRANK
  // ZREM
  // ZREMRANGEBYLEX
  // ZREMRANGEBYRANK
  // ZREMRANGEBYSCORE
  // ZREVRANGE
  // ZREVRANGEBYLEX
  // ZREVRANGEBYSCORE
  // ZREVRANK
  // ZSCAN
  // ZSCORE
  // ZUNIONSTORE

  return {
    auth,
    append,
    bitcount,
    bitop,
    bitpos,
    decr,
    decrby,
    del,
    get,
    set,
  };
}
