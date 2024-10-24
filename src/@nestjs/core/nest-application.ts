import path from "path";
import "reflect-metadata";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { Logger } from "./logger";
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from "@nestjs/constant";

export class NestApplication {
  private readonly app: Express = express();
  // 把provide存储在全局上
  private readonly providersMap = new Map();
  constructor(private readonly module: any) {
    this.app.use(express.json()); //用来把JSON格式的请求体对象放在req.body上
  }

  private initProviders() {
    // 获取模块导入的元数据
    const imports = Reflect.getMetadata("imports", this.module) || [];
    // 遍历所有的导入模块
    for (let importedModule of imports) {
      // 获取导入模块的提供者
      const importModuleProviders =
        Reflect.getMetadata("providers", importedModule) || [];
      // 遍历添加每个提供者注册到全局
      importModuleProviders.forEach((provider) => this.addProvider(provider));
    }
    // 获取跟模块的提供者注册到全局
    const moduleProviders = Reflect.getMetadata("providers", this.module) || [];
    moduleProviders.forEach((provider) => this.addProvider(provider));
  }

  addProvider(provider) {
    if (provider.provide) {
      if (provider?.useClass) {
        // 需要实例化, 并注入依赖
        const dependencies = this.resolveDependencies(provider.useClass);
        const instance = new provider.useClass(...dependencies);
        this.providersMap.set(provider.provide, instance);
      } else if (provider?.useValue) {
        this.providersMap.set(provider.provide, provider.useValue);
      } else if (provider?.useFactory) {
        // 解析依赖
        const inject = provider.inject || [];
        const injectedValues = inject.map(this.getProviderByToken.bind(this));
        const value = provider.useFactory(...injectedValues);
        this.providersMap.set(provider.provide, value);
      }
    } else {
      const dependencies = this.resolveDependencies(provider);
      this.providersMap.set(provider, new provider(...dependencies));
    }
  }

  // 注册express的中间件
  use(middleware) {
    this.app.use(middleware);
  }

  // 根据token获取依赖
  private getProviderByToken(injectedToken) {
    return this.providersMap.get(injectedToken) ?? injectedToken;
  }
  // 解析类依赖
  private resolveDependencies(Clazz) {
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Clazz) || [];
    const constructorParams =
      Reflect.getMetadata(DESIGN_PARAMTYPES, Clazz) || [];
    return constructorParams.map((item, index) => {
      const injectParam = injectedTokens[index] || item;
      const injectProvider = this.getProviderByToken(injectParam);
      return injectProvider;
    });
  }

  private resolveParams(
    controllerPrototype,
    methodName,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const params =
      Reflect.getMetadata("params", controllerPrototype, methodName) || [];
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
        getNext: () => next,
      }),
    };
    return params.map((param) => {
      const { key, data, factory } = param;
      switch (key) {
        case "Ip":
          return req.ip;
        case "Session":
          return req.session;
        case "DecoratorFactory":
          return typeof factory === "function" && factory(data, ctx);
        case "Next":
          return next;
        case "Req":
        case "Request":
          return data ? req[data] : req;
        case "Res":
        case "Response":
          return data ? res[data] : res;
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

  getResponseMetaData(controller, methodName) {
    const paramMetaData =
      Reflect.getMetadata("params", controller, methodName) || [];
    return paramMetaData
      .filter(Boolean)
      .find(
        (item) =>
          item.key === "Res" || item.key === "Response" || item.key === "Next"
      );
  }

  init() {
    const Constollers = Reflect.getMetadata("controllers", this.module) || [];

    for (let Controller of Constollers) {
      const dependencies = this.resolveDependencies(Controller);
      const controllerInstance = new Controller(...dependencies);
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
        // 重定向的元数据
        const redirectUrl = Reflect.getMetadata("redirectUrl", method);
        const redirectStatusCode = Reflect.getMetadata(
          "redirectStatusCode",
          method
        );
        // 获取请求码
        const httpCode = Reflect.getMetadata("httpCode", method);
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
            const result = method.call(controllerInstance, ...methodParams);
            // 如果返回的值有url也同样执行重定向
            if (result && result?.url) {
              res.redirect(result.statusCode || 302, result.url);
              return;
            }
            if (redirectUrl) {
              res.redirect(redirectStatusCode || 302, redirectUrl);
              return;
            }
            if (httpCode) {
              res.status(httpCode);
            } else if (httpMehtod == "POST") {
              // nestjs服务201默认返回201状态码
              res.status(201);
            }
            // 当用户注入@Res、@Response、@Next时, 同时并没有传递passthrough属性, 将用于用户自己响应, 判断是否需要用户自己响应
            const responseMetaData = this.getResponseMetaData(
              controllerPrototype,
              methodName
            );
            if (!responseMetaData || responseMetaData?.data?.passthrough) {
              res.send(result);
              return result;
            }
          }
        );
      }
    }
  }

  async listen(port: number) {
    // 初始化provide
    await this.initProviders();
    // 初始化controller路由
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
