import { Injectable } from "@nestjs/common";
import { NestMiddleware } from "@nestjs/types";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("---middleware---");
    next();
  }
}
