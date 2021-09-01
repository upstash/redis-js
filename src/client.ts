import fetch from "isomorphic-unfetch";

export default function client(url?: string, token?: string) {
  let baseURL: string | null = url ?? process.env.UPSTASH_URL ?? null;
  let authToken: string | null = token ?? process.env.UPSTASH_TOKEN ?? null;

  async function auth(url: string, token: string) {
    baseURL = url;
    authToken = token;
  }

  async function generator(...parts: (string | number | boolean)[]) {
    const fetchURL = `${baseURL}/${parts.join("/")}`;

    const response = await fetch(fetchURL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json());

    if (response.error) {
      return {
        data: undefined,
        error: response.error,
        status: response.status,
      };
    }

    return { data: response.result, error: undefined };
  }

  async function set(key: string, value: string) {
    return generator("set", key, value);
  }

  async function get(key: string) {
    return generator("get", key);
  }

  return {
    auth,
    set,
    get,
  };
}
