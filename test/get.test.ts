import { get, set } from '../src';
import { nanoid } from 'nanoid';

describe('get command', () => {
  it('return null', async () => {
    const { data } = await get('key/null');
    expect(data).toBe(null);
  });

  it('return a value without edge', async () => {
    const key = nanoid();
    await set(key, 'hello');

    const { data } = await get(key, { edge: false });
    expect(data).toBe('hello');
  });

  it('return a value with edge', async () => {
    const key = nanoid();

    await set(key, 'hello');

    const { data } = await get(key);
    expect(data).toBe('hello');
  });

  it('callback', (done) => {
    const key = nanoid();

    set(key, 'hello')
      .then(({ data }) => {
        expect(data).toBe('OK');
      })
      .then(() => {
        get(key, null, ({ data: getData }) => {
          expect(getData).toBe('hello');
          done();
        });
      });
  });
});
