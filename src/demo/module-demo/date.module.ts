import { Module } from "@nestjs/common";
import {
  LoggerYear,
  LoggerMonth,
  UseValueLoggerDate,
  UseFactoryLoggerMessage,
} from "./date.service";

@Module({
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
export class DateModule {}
