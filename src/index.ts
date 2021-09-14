import client from './client';

export default client;

const { auth, get, set, append, decr, decrby } = client();
export { auth, get, set, append, decr, decrby };
