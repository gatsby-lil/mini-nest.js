import "reflect-metadata";

interface ModuleMetaData {
  controllers?: any[];
}

export function Module(moduleMetaData: ModuleMetaData) {
  return function (target: Function) {
    Reflect.defineMetadata(
      "controllers",
      moduleMetaData.controllers || [],
      target
    );
  };
}
