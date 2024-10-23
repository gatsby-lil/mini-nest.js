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
      provide: "UseValueLoggerDate",
      useValue: new UseValueLoggerDate(),
    },
    {
      provide: "flag",
      useValue: "flag: develop a website",
    },
    {
      provide: "UseFactoryLoggerMessage",
      inject: ["UseValueLoggerDate", "Happy New Year"],
      useFactory: (u, message) => new UseFactoryLoggerMessage(u, message),
    },
  ],
})
export class AppModule {}
