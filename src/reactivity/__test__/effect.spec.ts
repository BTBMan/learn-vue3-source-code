import { effect } from '../src';

describe('effect', () => {
  test('first test effect', () => {
    const runner = effect(
      () => {
        console.log('用户传入的fn函数里的代码');
      },
      {
        flush: 'post',
      },
    );

    console.log('runner test', runner);
  });
});
