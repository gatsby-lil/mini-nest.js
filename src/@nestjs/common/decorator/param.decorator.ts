import { DESIGN_PARAMTYPES } from "@nestjs/constant";
import "reflect-metadata";

export function createParamDecorator(keyOrFunction: string | Function) {
  return function (data?: any, ...pipes: any[]) {
    return function (target: object, properKey: string, paramIndex: number) {
      const existingParam =
        Reflect.getMetadata("params", target, properKey) || [];
      // 从原型的方法上获取参数类型
      const constructorParams =
        Reflect.getMetadata(DESIGN_PARAMTYPES, target, properKey) || [];
      const metatype = constructorParams[paramIndex];
      if (keyOrFunction instanceof Function) {
        existingParam[paramIndex] = {
          key: "DecoratorFactory",
          factory: keyOrFunction,
          data,
          paramIndex,
          pipes,
          metatype,
        };
      } else {
        existingParam[paramIndex] = {
          data,
          key: keyOrFunction,
          paramIndex,
          pipes,
          metatype,
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
