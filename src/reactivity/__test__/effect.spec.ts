import { effect, reactive } from '../src';

describe('effect', () => {
  test('first test effect', () => {
    const runner = effect(
      () => {
        // console.log('用户传入的fn函数里的代码');
      },
      {
        flush: 'post',
      },
    );

    // console.log('runner test', runner);
  });

  it('should run the passed function once (wrapped by a effect) 被effect包装过的函数默认只执行一次', () => {
    const fnSpy = jest.fn(() => {});
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it('should observe basic properties 观察基本的属性', () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));

    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  });

  it.skip('should observe multiple properties 观察多个属性', () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 });
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

    expect(dummy).toBe(0);
    counter.num1 = counter.num2 = 7;
    expect(dummy).toBe(21);
  });

  it.skip('should handle multiple effects 处理多个effect', () => {
    let dummy1, dummy2;
    const counter = reactive({ num: 0 });
    effect(() => (dummy1 = counter.num));
    effect(() => (dummy2 = counter.num));

    expect(dummy1).toBe(0);
    expect(dummy2).toBe(0);
    counter.num++;
    expect(dummy1).toBe(1);
    expect(dummy2).toBe(1);
  });

  it.skip('should observe nested properties 观察嵌套的属性', () => {
    let dummy;
    const counter = reactive({ nested: { num: 0 } });
    effect(() => (dummy = counter.nested.num));

    expect(dummy).toBe(0);
    counter.nested.num = 8;
    expect(dummy).toBe(8);
  });

  it.skip('should observe function call chains 观察函数的调用链', () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = getNum()));

    function getNum() {
      return counter.num;
    }

    expect(dummy).toBe(0);
    counter.num = 2;
    expect(dummy).toBe(2);
  });

  it.skip('scheduler 调度器', () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler },
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  // it('stop 停止effect', () => {
  //   let dummy;
  //   const obj = reactive({ prop: 1 });
  //   const runner = effect(() => {
  //     dummy = obj.prop;
  //   });
  //   obj.prop = 2;
  //   expect(dummy).toBe(2);
  //   stop(runner);
  //   // obj.prop = 3
  //   obj.prop++;
  //   expect(dummy).toBe(2);

  //   // stopped effect should still be manually callable
  //   runner();
  //   expect(dummy).toBe(3);
  // });

  // it('events: onStop onStop事件', () => {
  //   const onStop = jest.fn();
  //   const runner = effect(() => {}, {
  //     onStop,
  //   });

  //   stop(runner);
  //   expect(onStop).toHaveBeenCalled();
  // });
});
