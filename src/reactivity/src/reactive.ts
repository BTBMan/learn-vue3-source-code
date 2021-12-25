export const reactiveMap = new WeakMap(); // 存放所有依赖

export function reactive(target) {
  // 当用户使用reactive的时候 就会返回一个创建的reactive的对象
  return createReactiveObject(target, reactiveMap);
}

// 创建reactive对象的方法单独抽离 以便共用逻辑
function createReactiveObject(target, proxyMap) {
  // 首先找一下是否存在这个reactive

  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, {
    get(t, k, r) {},
    set(t, k, v, r) {
      return true;
    },
  });
  proxyMap.set(target, proxy);

  return proxy;
}

// test
// const obj = {
//   a: 'a',
// };

// const proxy = new Proxy(obj, {
//   get(t, k, r) {
//     console.log(11, t, k, r);
//   },
//   set(t, k, v, r) {
//     console.log(22, t, k, v, r);

//     return false;
//   },
// });

// proxy.a;
// proxy.a = 'c';

// console.log(proxy);
// console.log(obj);
