import { ArgumentsHost } from "./common.type";

export interface ExceptionFilter<T = any> {
  catch(exception: T, host: ArgumentsHost): any;
}
