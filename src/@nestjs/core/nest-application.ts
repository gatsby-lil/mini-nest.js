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
  constructor(private readonly module: any) {}
  init() {
    const Constollers = Reflect.getMetadata("controllers", this.module) || [];
    for (let Controller of Constollers) {
      // 获取每个Controller的路由前缀
      const prefix = Reflect.getMetadata("prefix", Controller);
      const controllerPrototype = Controller.prototype;
      // 通过原型获取到每一个路由处理函数
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
            const result = method.call(Controller);
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
