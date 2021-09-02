import fetch from 'isomorphic-unfetch';
import urlRegex from 'url-regex';

export type ReturnType =
  | {
      data: null | string | number | [];
      error: undefined;
      status: number;
    }
  | {
      data: undefined;
      error: string;
      status: number | undefined;
    };

export default function client(url?: string, token?: string) {
  let baseURL: string = url ?? process.env.UPSTASH_URL ?? '';
  let authToken: string = token ?? process.env.UPSTASH_TOKEN ?? '';

  async function auth(url: string, token: string) {
    baseURL = url;
    authToken = token;
  }

  async function request(...parts: (string | number | boolean)[]) {
    const isValidURL = urlRegex({ exact: true }).test(baseURL);
    if (!isValidURL) {
      return {
        data: undefined,
        error: 'Only absolute URLs are supported',
        status: undefined,
      };
    }

    const isIncludeUpstash = baseURL.match('.upstash.io');
    if (!isIncludeUpstash) {
      return {
        data: undefined,
        error: 'This url does not address upstash',
        status: undefined,
      };
    }

    const fetchURL = `${baseURL}/${parts.join('/')}`;

    try {
      const res = await fetch(fetchURL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();

      return {
        data: data.result,
        error: undefined,
        status: res.status,
      };
    } catch (e) {
      return {
        data: undefined,
        error: e.message,
        status: undefined,
      };
    }
  }

  async function set(key: string, value: string): Promise<ReturnType> {
    return request('set', key, value);
  }

  async function get(key: string): Promise<ReturnType> {
    return request('get', key);
  }

  async function append(key: string, value: string): Promise<ReturnType> {
    return request('append', key, value);
  }

  return {
    auth,
    set,
    get,
    append,
  };
}
