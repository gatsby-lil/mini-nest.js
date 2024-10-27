import "reflect-metadata";

export function createParamDecorator(keyOrFunction: string | Function) {
  return function (data?: any, ...pipes: any[]) {
    return function (target: object, properKey: string, paramIndex: number) {
      const existingParam =
        Reflect.getMetadata("params", target, properKey) || [];
      if (keyOrFunction instanceof Function) {
        existingParam[paramIndex] = {
          key: "DecoratorFactory",
          factory: keyOrFunction,
          data,
          paramIndex,
          pipes,
        };
      } else {
        existingParam[paramIndex] = {
          data,
          key: keyOrFunction,
          paramIndex,
          pipes,
        };
      }

      Reflect.defineMetadata("params", existingParam, target, properKey);
    };
  };
}

export const Req = createParamDecorator("Req");
export const Request = createParamDecorator("Request");
export const Query = createParamDecorator("Query");
export const Body = createParamDecorator("Body");
export const Param = createParamDecorator("Param");
export const Ip = createParamDecorator("Ip");
export const Headers = createParamDecorator("Headers");
export const HostParam = createParamDecorator("HostParam");
export const Session = createParamDecorator("Session");

export const Res = createParamDecorator("Res");
export const Response = createParamDecorator("Response");
export const Next = createParamDecorator("Next");
