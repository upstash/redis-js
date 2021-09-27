import { flushdb, mset, scan } from '../src';
import { nanoid } from 'nanoid';

describe('scan command', () => {
  it('basic', async () => {
    await flushdb();

    const fields = [nanoid(), '1', nanoid(), '2', nanoid(), '3', nanoid(), '4'];
    await mset(fields);

    const { data: data1 } = await scan(0);
    expect(data1).toBeInstanceOf(Array);
  });

  it('with match', async () => {
    await flushdb();

    const fields = [
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ];
    await mset(fields);

    const { data } = await scan(0, { match: '*_*' });
    expect(data[0]).toBe('0');
  });

  it('with count', async () => {
    await flushdb();

    const fields = [nanoid(), '1', nanoid(), '2', nanoid(), '3', nanoid(), '4'];
    await mset(fields);

    const { data } = await scan(0, { count: 2 });
    expect(data[0]).toBe('2');
  });

  it('with match and count', async () => {
    await flushdb();

    const fields = [
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ];
    await mset(fields);

    const { data } = await scan(0, { match: '*_*', count: 1 });
    expect(data[0]).toBe('1');
  });
});
