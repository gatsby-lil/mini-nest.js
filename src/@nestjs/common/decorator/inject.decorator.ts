import "reflect-metadata";
import { INJECTED_TOKENS } from "@nestjs/constant";
/**
 * * 在类的构造函数中使用
 * @param injectToken: 标注注入了哪个依赖
 * @returns 返回一个参数装饰器
 */
export function Inject(injectToken: string = ""): ParameterDecorator {
  return function (target: object, properkey: string, paramIndex: number) {
    // 取出已经注入的
    const existingInjectTokens =
      Reflect.getMetadata(INJECTED_TOKENS, target) || [];
    existingInjectTokens[paramIndex] = injectToken;
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectTokens, target);
  };
}
