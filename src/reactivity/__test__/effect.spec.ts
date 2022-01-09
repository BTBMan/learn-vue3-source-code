import { effect } from '../src';

describe('effect', () => {
  test('first test effect', () => {
    effect(
      () => {
        console.log('effect函数里的代码');
      },
      {
        flush: 'post',
      },
    );
  });
});
