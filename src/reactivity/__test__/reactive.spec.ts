import { reactive } from '../src/index';

describe('reactive', () => {
  test('test', () => {
    expect(1 + 1).toBe(2);

    const obj = {
      a: 'a',
      b: {
        c: 'c',
      },
    };

    const data1 = reactive(obj);

    // data1.a = 'b';

    data1.b.c;
    data1.b.c;
  });
});
