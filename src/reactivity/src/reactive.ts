// export
const reactiveMap = new WeakMap(); // 用来缓存已经创建过的reactive

// export
function reactive(target) {
  // 当用户使用reactive的时候 就会返回一个创建的reactive的对象
  return createReactiveObject(target, reactiveMap);
}

// 创建reactive对象的方法单独抽离 以便共用逻辑
function createReactiveObject(target, proxyMap) {
  // 首先在缓存列表里查找是否存在这个reactive
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      Reflect.set(target, key, value);

      return false;
    },
  });
  proxyMap.set(target, proxy);

  return proxy;
}

// test
// const obj = {
//   a: 'a',
// };

// const reactiveObj = reactive(obj);
// const reactiveObj1 = reactive(obj);
// console.log(reactiveObj);
// reactiveObj.a = 'aa';
// console.log(reactiveObj);
// console.log(reactiveObj1);
// console.log(obj);

// console.log('===========');

// console.log(reactiveObj.a);

// console.log('===========');

// console.log(reactiveObj === reactiveObj1);

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
