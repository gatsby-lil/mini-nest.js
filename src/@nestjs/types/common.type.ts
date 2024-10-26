export interface ArgumentsHost {
  switchToHttp(): {
    getRequest<T = any>(): T;
    getResponse<T = any>(): T;
    getNext<T = any>(): T;
  };
}
