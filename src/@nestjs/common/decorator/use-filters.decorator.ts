import "reflect-metadata";
// 即可以装饰给整个控制器, 也可以装饰给控制器中的某个方法
export function UseFilters(...filters: any[]) {
  return function (
    target: object | Function,
    properKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (descriptor) {
      Reflect.defineMetadata("filters", filters, descriptor.value);
    } else {
      Reflect.defineMetadata("filters", filters, target);
    }
  };
}
