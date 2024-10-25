import "reflect-metadata";

interface ModuleMetaData {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
  exports?: any[];
}
/**
 * 1. 模块是用 @Module() 装饰器注释的类。@Module() 装饰器提供的元数据被 Nest 用来组织应用程序结构。
 * 2. 在 Nest 中，模块默认是单例的，因此您可以轻松地在多个模块之间共享任何提供者的同一个实例
 * 3. 每个模块都是自动共享模块。一旦创建，它就可以被任何模块重用。
 *
 *
 */
export function Module(moduleMetaData: ModuleMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(
      "controllers",
      moduleMetaData.controllers || [],
      target
    );
    Reflect.defineMetadata("providers", moduleMetaData.providers || [], target);
    Reflect.defineMetadata("exports", moduleMetaData.exports || [], target);
    Reflect.defineMetadata("imports", moduleMetaData.imports || [], target);
    Reflect.defineMetadata("isModule", true, target);
    defineModule(moduleMetaData.controllers, target);
    defineModule(moduleMetaData.providers, target);
  };
}

export function defineModule(providers = [], module) {
  providers?.forEach((item) => {
    // 这两种情况是有可能进行依赖注入的, 而依赖的注入又是根据模块来进行隔离的, 所以需要给他们添加元数据模块，方便初始化的时候依赖注入
    if (item instanceof Function) {
      Reflect.defineMetadata("module", module, item);
    } else if (item?.useClass instanceof Function) {
      Reflect.defineMetadata("module", module, item.useClass);
    }
  });
}

export function Global(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("global", true, target);
  };
}
