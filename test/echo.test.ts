import { echo } from '../dist/main';
import { nanoid } from 'nanoid';

describe('echo command', () => {
  it('basic', async () => {
    const value = nanoid();

    const { data } = await echo(value);
    expect(data).toBe(value);
  });
});
