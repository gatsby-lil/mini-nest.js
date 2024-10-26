import { Response } from "express";

import { ArgumentsHost, ExceptionFilter, HttpStatus } from "@nestjs/types";
import { HttpException } from "./httpException";

export class GlobalHttpExecptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "string") {
        response.status(status).json({
          statusCode: status,
          message: exceptionResponse,
        });
      } else {
        response.status(status).send(exceptionResponse);
      }
    } else {
      return response.status(500).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
}
