import { reactive } from '../src/index';

describe('reactive', () => {
  test('test', () => {
    expect(1 + 1).toBe(2);

    const obj = { a: 'a' };

    const data1 = reactive(obj);

    data1.a = 'b';
  });
});
