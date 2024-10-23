import "reflect-metadata";

interface ModuleMetaData {
  controllers?: any[];
  providers?: any[];
}

export function Module(moduleMetaData: ModuleMetaData) {
  return function (target: Function) {
    Reflect.defineMetadata(
      "controllers",
      moduleMetaData.controllers || [],
      target
    );
    Reflect.defineMetadata("providers", moduleMetaData.providers || [], target);
  };
}
