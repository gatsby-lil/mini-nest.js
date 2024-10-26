import { Request, Response, NextFunction } from "express";
import { RequestMethod } from "./http.type";

// 实现接口
export interface NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any;
}

// NestApplication实例
export interface MiddlewareConsumer {
  apply(...middleware: any[]): this;
  forRoutes(
    ...routes: (string | { path: string; method: RequestMethod } | Function)[]
  ): this;
}

// 实现接口
export interface NestModule {
  configure(consumer: MiddlewareConsumer): void;
}
