import { time } from '../dist/main';

describe('time command', () => {
  it('basic', async () => {
    const { data } = await time();
    expect(data).toBeInstanceOf(Array);
  });
});
