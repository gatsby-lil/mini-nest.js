import { ArgumentsHost } from "./common.type";

export interface ExecutionContext extends ArgumentsHost {
  //用于获取当前的处理类，也就是控制器的类
  getClass<T = any>(): T;
  // 用于获取路由处理函数
  getHandler(): Function;
}

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean;
}
