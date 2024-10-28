import { NestMiddleware } from "@nestjs/types";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (req as any).user = { id: 1, roles: [req.query.role] };
    next();
  }
}
