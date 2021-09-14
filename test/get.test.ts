// import { nanoid } from 'nanoid';
import { get } from '../src';

describe('redis get command', () => {
  it('should return null', async () => {
    const { data } = await get('key1/null');
    expect(data).toEqual(null);
  });

  it('should return a value', async () => {
    const { data } = await get('key1');
    expect(data).toEqual(
      "expect(data).toEqual('kyBoCJCXNquQCxjs0VMD4_yaLJ38msLFNFPb-EH1wh');"
    );
  });

  it('should run callback', (done) => {
    get('key1', ({ data }) => {
      expect(data).toEqual('kyBoCJCXNquQCxjs0VMD4_yaLJ38msLFNFPb-EH1wh');
      done();
    });
  });
});
