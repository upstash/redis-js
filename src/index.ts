import client from './client';

export default client;

const { auth, get, set, append } = client();
export { auth, get, set, append };
