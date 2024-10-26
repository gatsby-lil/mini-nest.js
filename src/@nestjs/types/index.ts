import { Request, Response, NextFunction } from "express";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  ALL = "ALL", //ALL能匹配所有的方法
}

export interface NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any;
}

export interface MiddlewareConsumer {
  apply(...middleware: any[]): this;
  forRoutes(
    ...routes: (string | { path: string; method: RequestMethod } | Function)[]
  ): this;
}

export interface NestModule {
  configure(consumer: MiddlewareConsumer): void;
}
