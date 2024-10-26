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
import { defineModule } from "@nestjs/common";
import { RequestMethod } from "@nestjs/types";

export class NestApplication {
  private readonly app: Express = express();
  // 把provide存储在全局上
  private readonly providersInstanceMap = new Map();
  // 全局的provide即: 使用了@Global修饰的模块下的provider
  private readonly globalProviders = new Set();
  // 每个模块对应暴漏的provider
  private readonly moduleProviders = new Map();
  // 缓存middleware
  private readonly middlewares = [];
  // 记录所有要排除的路径
  private readonly excludedRoutes = [];
  constructor(private readonly module: any) {
    this.app.use(express.json()); //用来把JSON格式的请求体对象放在req.body上
  }

  private async initMiddlewares() {
    // 调用模块的中配置中间的的方法，MiddlewareConsumer就是当前的NestApplication的实例
    this.module?.prototype?.configure(this);
  }

  apply(...middlewares: any[]): this {
    // 把中间件同Module关联, 方便后续的依赖注入
    defineModule(middlewares, this.module);
    // 把所有的中间件, 加入到全局中
    this.middlewares.push(...middlewares);
    // 返回实例进行链式调用
    return this;
  }

  isExcluded(reqPath: string, method) {
    return this.excludedRoutes.some((routeInfo) => {
      const { routePath, routeMethod } = routeInfo;
      return (
        reqPath === routePath &&
        (method === routeMethod || method === RequestMethod.ALL)
      );
    });
  }

  // 排除路由
  exclude(...routes): this {
    this.excludedRoutes.push(routes.map(this.normalizeRouteInfo));
    return this;
  }

  forRoutes(...routes): this {
    for (const route of routes) {
      for (const middleware of this.middlewares) {
        // route的传参方式有很多种, 转成统一格式
        const { routePath, routeMethod } = this.normalizeRouteInfo(route);
        // 把中间件注册的express中
        this.app.use(
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            // 判断是否在排除的路由中
            if (this.isExcluded(req.originalUrl, req.method)) {
              return next();
            }
            // 路由匹配执行
            if (
              req.method === routeMethod ||
              routeMethod === RequestMethod.ALL
            ) {
              // 此处的middleware可能是一个类、实例、函数
              if (middleware?.use || middleware?.prototype?.use) {
                // 实例化中间件
                const middlewareInstance =
                  this.getMiddlewareInstace(middleware);
                middlewareInstance?.use(req, res, next);
              } else if (middleware instanceof Function) {
                middleware(req, res, next);
              } else {
                next();
              }
            } else {
              next();
            }
          }
        );
      }
    }
    return this;
  }

  getMiddlewareInstace(middleware) {
    // 传递的是一个类
    if (middleware instanceof Function) {
      const dependcies = this.resolveDependencies(middleware);
      const middlewareInstance = new middleware(...dependcies);
      return middlewareInstance;
    }
    return middleware;
  }

  private normalizeRouteInfo(route) {
    let routePath = "",
      routeMethod = RequestMethod.ALL;
    if (typeof route === "string") {
      routePath = route;
    } else if (typeof route === "object" && route?.path) {
      routePath = route.path;
      routeMethod = route.method ?? RequestMethod.ALL;
    } else if (route instanceof Function) {
      // 若传递的是一个控制器, 则以控制器的前缀为路径
      const prefix = Reflect.getMetadata("prefix", route);
      routePath = prefix;
    }
    routePath = path.posix.join("/", routePath);
    return {
      routePath,
      routeMethod,
    };
  }

  private async initProviders() {
    // 获取模块导入的元数据
    const imports = Reflect.getMetadata("imports", this.module) || [];
    // 遍历所有的导入模块
    for (let importModule of imports) {
      let importedModule = importModule;
      // 判断是否是一个Promise, 动态模块forRoot方法执行有可能返回的是一个Promise
      if (importedModule instanceof Promise) {
        importedModule = await importedModule;
      }
      // 判断是否是一个动态模块
      if (importModule.module) {
        // 获取动态模块返回的模块定义
        const {
          module,
          exports = [],
          controllers = [],
          providers = [],
        } = importModule;
        // 把老的和新的providers、exports、controllers进行合并
        const oldControllers = Reflect.getMetadata("controllers", module) || [];
        const newControllers = [...oldControllers, ...controllers];
        const oldProviders = Reflect.getMetadata("providers", module) || [];
        const newProviders = [...oldProviders, ...providers];
        const oldExports = Reflect.getMetadata("exports", module) || [];
        const newExports = [...oldExports, ...exports];
        defineModule(newControllers, module);
        defineModule(newProviders, module);
        Reflect.defineMetadata("controllers", newControllers, module);
        Reflect.defineMetadata("providers", newProviders, module);
        Reflect.defineMetadata("exports", newExports, module);
        this.registerProviderByModule(module, this.module);
      } else {
        this.registerProviderByModule(importedModule, this.module);
      }
    }
    // 获取跟模块的提供者注册到全局
    const moduleProviders = Reflect.getMetadata("providers", this.module) || [];
    moduleProviders.forEach((provider) =>
      this.addProvider(provider, this.module)
    );
  }

  /**
   *
   * @param module: 当前处理的模块
   * @param parentModule: 当前模块所属的父模块
   * 场景: A模块引用B模块 B模块导入导出C模块 C模块导入并导出D模块 D模块里有一个exports[DService], A B C D模块 都可以使用DService
   */
  private registerProviderByModule(module, ...parentModules) {
    const global = Reflect.getMetadata("global", module);
    const providers = Reflect.getMetadata("providers", module);
    const moduleExports = Reflect.getMetadata("exports", module);
    for (const exportToken of moduleExports) {
      // 导出的是一个模块, 则递归处理
      if (this.isModule(exportToken)) {
        this.registerProviderByModule(exportToken, module, ...parentModules);
      } else {
        // * 每个模块exports应该是providers的子集, 即exports中的每一项都在providers中, 则进行注册
        const provider = providers.find(
          (p) => p === exportToken || p.provide === exportToken
        );
        if (provider) {
          [module, ...parentModules].forEach((module) => {
            this.addProvider(provider, module, global);
          });
        }
      }
    }
  }

  addProvider(provider, module, global = false) {
    const providers = global
      ? this.globalProviders
      : this.moduleProviders.get(module) || new Set();
    // 根据Module进行提供者隔离
    if (!global) {
      this.moduleProviders.set(module, providers);
    }
    // 需要注册的token, 避免重复注入
    const injectToken = provider?.provide || provider;
    if (this.providersInstanceMap.has(injectToken)) {
      if (!providers.has(injectToken)) {
        providers.add(injectToken);
      }
      return;
    }
    if (provider.provide) {
      if (provider?.useClass) {
        // 需要实例化, 并注入依赖
        const injectToken = provider.provide || provider;
        const dependencies = this.resolveDependencies(provider.useClass);
        const instance = new provider.useClass(...dependencies);
        this.providersInstanceMap.set(provider.provide, instance);
        providers.add(injectToken);
      } else if (provider?.useValue) {
        this.providersInstanceMap.set(provider.provide, provider.useValue);
        providers.add(provider.provide);
      } else if (provider?.useFactory) {
        // 解析依赖
        const inject = provider.inject || [];
        const injectedValues = inject.map(this.getProviderByToken.bind(this));
        const value = provider.useFactory(...injectedValues);
        this.providersInstanceMap.set(provider.provide, value);
        providers.add(provider.provide);
      }
    } else {
      const dependencies = this.resolveDependencies(provider);
      this.providersInstanceMap.set(provider, new provider(...dependencies));
      providers.add(provider);
    }
  }

  // 注册express的中间件
  use(middleware) {
    this.app.use(middleware);
  }

  // 判断是否是模块
  private isModule(injectToken) {
    return (
      injectToken &&
      injectToken instanceof Function &&
      Reflect.getMetadata("isModule", injectToken)
    );
  }

  // 根据token获取依赖
  private getProviderByToken(injectedToken, module) {
    // 先从全局模块中查找是否有被标记
    if (this.globalProviders.has(injectedToken)) {
      return this.providersInstanceMap.get(injectedToken);
    }
    if (this.moduleProviders.get(module)?.has(injectedToken)) {
      return this.providersInstanceMap.get(injectedToken) ?? injectedToken;
    }
  }
  // 解析类依赖
  private resolveDependencies(Clazz) {
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Clazz) || [];
    // ! 类被装饰器装饰过才能生效
    const constructorParams =
      Reflect.getMetadata(DESIGN_PARAMTYPES, Clazz) || [];
    return constructorParams.map((item, index) => {
      const module = Reflect.getMetadata("module", Clazz);
      const injectParam = injectedTokens[index] || item;
      const injectProvider = this.getProviderByToken(injectParam, module);
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
    // 初始化中间件
    await this.initMiddlewares();
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
