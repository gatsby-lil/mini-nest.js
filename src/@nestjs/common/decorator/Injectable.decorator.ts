import "reflect-metadata";
export function Injectable(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("injectable", true, target);
  };
}
