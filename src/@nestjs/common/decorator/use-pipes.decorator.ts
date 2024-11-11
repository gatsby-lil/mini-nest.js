import { PipeTransform } from "@nestjs/types";
import "reflect-metadata";
export function UsePipes(...pipes: PipeTransform[]) {
  return function (
    target: object | Function,
    properKey?: string | Symbol,
    descriptor?: PropertyDescriptor
  ) {
    const existingPipes =
      Reflect.getMetadata(descriptor.value || target, "pipes") || [];
    const concatPipes = [...existingPipes, ...pipes];
    if (descriptor) {
      Reflect.defineMetadata("pipes", concatPipes, descriptor.value);
    } else {
      Reflect.defineMetadata("pipes", concatPipes, target);
    }
  };
}
