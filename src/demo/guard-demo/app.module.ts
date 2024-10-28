import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AuthMiddleware } from "./auth.middleware";
import { MiddlewareConsumer, NestModule } from "@nestjs/types";

@Module({
  controllers: [AccountController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
