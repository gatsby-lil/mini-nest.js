import "reflect-metadata";

function createParamDecorator(keyOrFunction: string | Function) {
  return function (data?: any) {
    return function (target: object, properKey: string, paramIndex: number) {
      console.log(target, properKey, paramIndex);
      const existingParam =
        Reflect.getMetadata("params", target, properKey) || [];
      existingParam[paramIndex] = {
        data,
        key: keyOrFunction,
        paramIndex,
      };
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

export const Session = createParamDecorator("Session");
export const Res = createParamDecorator("Res");
export const Response = createParamDecorator("Response");
