import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext } from "@nestjs/types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    //获得当前的请求对象
    const request: any = context.switchToHttp().getRequest<Request>();
    const user = request?.user;
    return user.roles.some((u) => roles.includes(u));
  }
}
