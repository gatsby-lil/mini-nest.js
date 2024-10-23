import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import {
  LoggerYear,
  LoggerMonth,
  UseValueLoggerDate,
  UseFactoryLoggerMessage,
} from "./app.service";

@Module({
  controllers: [AppController],
  providers: [
    LoggerYear,
    {
      provide: LoggerMonth,
      useClass: LoggerMonth,
    },
    {
      proivde: "UseValueLoggerDate",
      useValue: new UseValueLoggerDate(),
    },
    {
      provide: "UseFactoryLoggerMessage",
      inject: ["Happy New Year"],
      useFactory: (message) => new UseFactoryLoggerMessage(message),
    },
    {
      provide: "flag",
      useValue: "flag: develop a website",
    },
  ],
})
export class AppModule {}
