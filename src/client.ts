import fetch from 'isomorphic-unfetch';
// import urlRegex from 'url-regex';

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
    // const isValidURL = urlRegex({ exact: true }).test(baseURL);
    //
    // if (!isValidURL) {
    //   return {
    //     data: null,
    //     error: 'Only absolute URLs are supported',
    //   };
    // }
    //
    // const isIncludeUpstash = baseURL.match('.upstash.io');
    //
    // if (!isIncludeUpstash) {
    //   return {
    //     data: null,
    //     error: 'This url does not address upstash',
    //   };
    // }

    const fetchURL = `${baseURL}/${parts.join('/')}`;

    const promise: Promise<ReturnType> = new Promise((resolve, reject) => {
      return fetch(fetchURL, {
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
   * Get
   * @param {string} key - get key
   * @param {function} callback - command, key, values
   */
  function get(key: string, callback?: Callback): MethodReturn {
    return request(callback, 'get', key);
  }

  /**
   * Set
   * @param {string} key - set key
   * @param {string} value - set value
   * @param {function} callback - command, key, values
   */
  function set(key: string, value: string, callback?: Callback): MethodReturn {
    return request(callback, 'set', key, value);
  }

  /**
   * Append
   * @param {string} key - append key
   * @param {string} value - append value
   * @param {function} callback - command, key, values
   */
  function append(
    key: string,
    value: string,
    callback?: Callback
  ): MethodReturn {
    return request(callback, 'append', key, value);
  }

  return {
    auth,
    get,
    set,
    append,
  };
}
