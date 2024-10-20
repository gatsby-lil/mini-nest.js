import "reflect-metadata";

import { isObject, isString } from "@nestjs/utils";

interface ControllerOptions {
  prefix?: string;
}
export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix: ControllerOptions): ClassDecorator;

export function Controller(prefix?: string | ControllerOptions) {
  const prefixOptions: ControllerOptions = {};
  if (isString(prefix)) {
    prefixOptions.prefix = prefix as string;
  } else if (isObject(prefixOptions)) {
    prefixOptions.prefix = prefixOptions?.prefix || "";
  }
  return function (target: Function) {
    Reflect.defineMetadata("prefix", prefixOptions.prefix, target);
  };
}
