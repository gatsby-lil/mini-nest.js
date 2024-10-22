import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
  return function (
    target: object,
    properkey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}

export function Post(path: string = ""): MethodDecorator {
  return function (
    target: object,
    properKey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "POST", descriptor.value);
  };
}

export function Redirect(
  url: string = "",
  statusCode: number = 302
): MethodDecorator {
  return function (
    target: object,
    properKey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("redirectUrl", url, descriptor.value);
    Reflect.defineMetadata("redirectStatusCode", statusCode, descriptor.value);
  };
}

export function HttpCode(statusCode: number): MethodDecorator {
  return function (
    target: object,
    properKey: string | Symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("httpCode", statusCode, descriptor.value);
  };
}
