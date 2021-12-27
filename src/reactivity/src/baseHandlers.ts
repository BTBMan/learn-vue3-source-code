const set = createSetter(); // 每一种reactive类型的setter逻辑都是一样的
// 然而不同的reactive类型的getter逻辑是有区别的
const get = createGetter();

// 创建proxy的getter和setter方法 这里抽离出来的目的是为了方便创建其他类型的reactive劫持
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    // 这里处理getter的逻辑
    return Reflect.set(target, key, receiver);
  };
}

function createSetter() {
  return function (target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);

    return result;
  };
}

// 这个用来处理我们正常创建的reactive的劫持
export const mutableHandlers = {
  get,
  set,
};
