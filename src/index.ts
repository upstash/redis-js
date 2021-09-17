import client from './client';

export default client;

const { auth, append, bitcount, bitop, bitpos, decr, decrby, get, set } =
  client();
export { auth, append, bitcount, bitop, bitpos, decr, decrby, get, set };
