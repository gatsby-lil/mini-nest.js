import { Request, Response } from "express";
import {
  Catch,
  BadRequestException,
  RequestTimeoutException,
  Inject,
} from "@nestjs/common";
import { ArgumentsHost, ExceptionFilter } from "@nestjs/types";

@Catch(BadRequestException, RequestTimeoutException)
// 自定义过滤器
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(@Inject("PREFIX") private prefix?) {}
  catch(exception: any, host: ArgumentsHost) {
    // console.log(this.prefix, "prefix");
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      statusCode: status,
      message: exception.getResponse()?.message
        ? exception.getResponse()?.message
        : exception.getResponse(),
      timestamp: new Date().toLocaleString(),
      path: request.originalUrl,
      method: request.method,
    });
  }
}
