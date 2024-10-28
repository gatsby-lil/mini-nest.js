import "reflect-metadata";
export function UseGuards(...guards) {
  return (target: object | Function, propertyKey?: string, descriptor?) => {
    if (descriptor) {
      Reflect.defineMetadata("guards", guards, descriptor.value);
    } else {
      Reflect.defineMetadata("guards", guards, target);
    }
  };
}
