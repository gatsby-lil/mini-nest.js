import "reflect-metadata";
export function Inject(): ParameterDecorator {
  return function (target: object, properkey: string, paramIndex: number) {};
}
