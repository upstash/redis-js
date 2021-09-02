import client from './client';

export default client;

const { auth, get, set } = client();
export { auth, get, set };
