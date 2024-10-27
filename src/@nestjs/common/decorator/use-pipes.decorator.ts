import { PipeTransform } from "@nestjs/types";
import "reflect-metadata";
export function UsePipes(...pipes: PipeTransform[]) {
  return function (
    target: object | Function,
    properKey?: string | Symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (descriptor) {
      Reflect.defineMetadata("pipes", pipes, descriptor.value);
    } else {
      Reflect.defineMetadata("pipes", pipes, target);
    }
  };
}
