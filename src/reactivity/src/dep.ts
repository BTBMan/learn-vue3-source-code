// 用来存所有的effect函数的set合集 set的目的是为了保证依赖不重复
export function createDep(effects?) {
  const dep = new Set(effects);

  return dep;
}
