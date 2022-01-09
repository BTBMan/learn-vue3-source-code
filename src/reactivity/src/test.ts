// test
let fn: any = undefined;
fn = function () {
  console.log(fn()); // 超过最大调用栈
  console.log(fn); // 当前的fn函数
};

fn();
