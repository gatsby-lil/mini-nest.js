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
  };
}

export function Global(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("global", true, target);
  };
}
