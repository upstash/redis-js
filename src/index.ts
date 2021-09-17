import client from './client';

export default client;

const { auth, append, bitcount, bitop, decr, decrby, get, set } = client();
export { auth, append, bitcount, bitop, decr, decrby, get, set };
