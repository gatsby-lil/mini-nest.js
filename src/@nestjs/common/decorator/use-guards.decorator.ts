import "reflect-metadata";
export function UseGuards(...guards) {
  return (target: object | Function, propertyKey?: string, descriptor?) => {
    const existingGuards =
      Reflect.getMetadata(descriptor?.value || target, "guards") || [];
    const concatGuards = [...existingGuards, ...guards];
    if (descriptor) {
      Reflect.defineMetadata("guards", concatGuards, descriptor.value);
    } else {
      Reflect.defineMetadata("guards", concatGuards, target);
    }
  };
}
