import "reflect-metadata";
export function UseInterceptors(...interceptors) {
  return function (
    target: object | Function,
    propertyKey?: string,
    descriptor?
  ) {
    const existingInterceptors =
      Reflect.getMetadata(descriptor?.value || target, "interceptors") || [];
    const concatInterceptors = [...existingInterceptors, ...interceptors];
    if (descriptor.value) {
      Reflect.defineMetadata(
        "interceptors",
        concatInterceptors,
        descriptor.value
      );
    } else {
      Reflect.defineMetadata("interceptors", concatInterceptors, target);
    }
  };
}
