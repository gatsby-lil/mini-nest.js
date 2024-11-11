import "reflect-metadata";
// 即可以装饰给整个控制器, 也可以装饰给控制器中的某个方法
export function UseFilters(...filters: any[]) {
  return function (
    target: object | Function,
    properKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    const existingFilters =
      Reflect.getMetadata(descriptor.value || target, "filters") || [];
    const concatFilters = [...existingFilters, ...filters];
    if (descriptor) {
      Reflect.defineMetadata("filters", concatFilters, descriptor.value);
    } else {
      Reflect.defineMetadata("filters", concatFilters, target);
    }
  };
}
