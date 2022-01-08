const activeEffect = void 0; // 当前的正在工作的ReactiveEffect
const shouldTrack = false; // 是否可以收集依赖 默认是false 在ReactiveEffect.run当中会变为trur
const targetMap = new WeakMap(); // 用来保存依赖的对应关系

class ReactiveEffct {
  constructor(fn) {
    //
  }
}

// 通过使用我们知道 effect接收一个函数和个选项 函数内部是我们的业务逻辑相关的代码
export function effect(fn, options = {}) {
  // 创建一个ReactiveEffec实例
  const _effect = new ReactiveEffct(fn);
}

// 收集依赖
// target 为被收集的响应式依赖的原始对象 通过他去找到对应的依赖关系们
// type 在这里是干什么用的呢?
// key 为当前target对象里的key 为target下被依赖收集的key 通过他去找对应的依赖方法
// 收集只会在effect方法里才会进行的
export function track(target, type, key) {
  // 判断是否可以进行依赖收集
  // 也就是在ReactiveEffect.run的时候才可以
  // 也可以理解为须要在effect方法里才可以执行依赖收集
  if (!isTracking()) {
    return;
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}
