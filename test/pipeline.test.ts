import { pipeline, set } from '../src';
import { nanoid } from 'nanoid';

describe('pipeline command', () => {
  it('return object with commands', () => {
    const pipe = pipeline();
    expect(typeof pipe.set).toBe('function');
    expect(pipe.get('hello')).toEqual(pipe);
  });

  it('submit pipeline', async () => {
    const key = nanoid();
    const { data } = await pipeline().set(key, 'hello').get(key).submit();
    expect(data).toEqual(['OK', 'hello']);
  });

  it('callback', async () => {
    const key = nanoid();

    expect.assertions(1);
    await pipeline()
      .set(key, 'hello')
      .get(key)
      .submit(({ data }) => {
        expect(data).toEqual(['OK', 'hello']);
      });
  });
});
