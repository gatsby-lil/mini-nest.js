import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
  return function (
    target: Object,
    properkey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "Get", descriptor.value);
  };
}
