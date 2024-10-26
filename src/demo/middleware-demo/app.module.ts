import { Module } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";
import { MiddlewareConsumer, NestModule } from "@nestjs/types";
import { AppController } from "./app.controller";

@Module({
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("/logger");
  }
}
