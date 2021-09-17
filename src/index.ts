import client from './client';

export default client;

const { auth, append, bitcount, bitop, bitpos, decr, decrby, del, get, set } =
  client();
export { auth, append, bitcount, bitop, bitpos, decr, decrby, del, get, set };
