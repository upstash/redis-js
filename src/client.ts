import fetch from 'isomorphic-unfetch';

export type ReturnType =
  | {
      data: string | number | [];
      error: undefined;
      status: number;
    }
  | {
      data: undefined;
      error: string;
      status: number;
    };

export default function client(url?: string, token?: string) {
  let baseURL: string | null = url ?? process.env.UPSTASH_URL ?? null;
  let authToken: string | null = token ?? process.env.UPSTASH_TOKEN ?? null;

  async function auth(url: string, token: string) {
    baseURL = url;
    authToken = token;
  }

  async function generator(...parts: (string | number | boolean)[]) {
    const fetchURL = `${baseURL}/${parts.join('/')}`;

    const res = await fetch(fetchURL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await res.json();

    if (data.error) {
      return {
        data: undefined,
        error: data.error,
        status: res.status,
      };
    }

    return { data: data.result, error: undefined, status: res.status };
  }

  async function set(key: string, value: string): Promise<ReturnType> {
    return generator('set', key, value);
  }

  async function get(key: string): Promise<ReturnType> {
    return generator('get', key);
  }

  return {
    auth,
    set,
    get,
  };
}
