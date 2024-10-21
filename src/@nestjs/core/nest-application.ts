import path from "path";
import "reflect-metadata";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { Logger } from "./logger";

export class NestApplication {
  private readonly app: Express = express();
  constructor(private readonly module: any) {
    this.app.use(express.json()); //用来把JSON格式的请求体对象放在req.body上
  }
  // 注册express的中间件
  use(middleware) {
    this.app.use(middleware);
  }
  resolveParams(
    controllerPrototype,
    methodName,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const params =
      Reflect.getMetadata("params", controllerPrototype, methodName) || [];
    return params.map((param) => {
      const { key, data } = param;
      switch (key) {
        case "Ip":
          return req.ip;
        case "Req":
        case "Request":
          return data ? req[data] : req;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Body":
          return data ? req.body[data] : req.body;
        case "Param":
          return data ? req.params[data] : req.params;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        default:
          return null;
      }
    });
  }
  init() {
    const Constollers = Reflect.getMetadata("controllers", this.module) || [];

    for (let Controller of Constollers) {
      // 获取每个Controller的路由前缀
      const prefix = Reflect.getMetadata("prefix", Controller);
      // 通过原型获取到每一个路由处理函数
      const controllerPrototype = Controller.prototype;
      const prototypeMethods =
        Object.getOwnPropertyNames(controllerPrototype).filter(
          (n) => n != "constructor"
        ) || [];

      for (let methodName of prototypeMethods) {
        const method = controllerPrototype[methodName];
        const requestPath = Reflect.getMetadata("path", method);
        const httpMehtod: string = Reflect.getMetadata("method", method);
        if (!httpMehtod) {
          continue;
        }
        // 根据constroller前缀获取完整路由
        const routerPath = path.posix.join("/", prefix, requestPath);
        // 注册Express路由: this.app.get("/", () => {});
        this.app[httpMehtod.toLowerCase()](
          routerPath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            // 解析路由方法的参数
            const methodParams = this.resolveParams(
              controllerPrototype,
              methodName,
              req,
              res,
              next
            );
            const result = method.call(Controller, ...methodParams);
            res.send(result);
          }
        );
      }
    }
  }
  async listen(port: number) {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
