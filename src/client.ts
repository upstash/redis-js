import fetch from 'isomorphic-unfetch';

export type ReturnType = {
  data: null | string | number | [];
  error: null | string;
};

type MethodReturn = Promise<ReturnType>;
type Callback = (res: ReturnType) => any;
type Part = string | boolean | number;

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

  /**
   * GET
   * @param {string} key - key
   * @param {function} [callback] - callback function
   */
  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  /**
   * SET
   * @param {string} key - key
   * @param {string} value - value
   * @param {function} [callback] - callback function
   */
  function set(key: string, value: string, callback?: Callback): MethodReturn {
    return request(callback, 'set', key, value);
  }

  /**
   * APPEND
   * @param {string} key - key
   * @param {string} value - value
   * @param {function} [callback] - callback function
   */
  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'append', key, value);
  }

  /**
   * DECR
   * @param {string} key - key
   * @param {function} [callback] - callback function
   */
  function decr(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'decr', key);
  }

  /**
   * DECRBY
   * @param {string} key - key
   * @param {string} value - value
   * @param {function} [callback] - callback function
   */
  function decrby(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'decrby', key, value);
  }

  return {
    auth,
    get,
    set,
    append,
    decr,
    decrby,
  };
}
