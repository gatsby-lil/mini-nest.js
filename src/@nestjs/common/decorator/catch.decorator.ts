import "reflect-metadata";

export function Catch(...exceptions): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("catch", exceptions, target);
  };
}
