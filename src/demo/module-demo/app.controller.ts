import { Controller, Get, Inject } from "@nestjs/common";
import { LoggerYear, LoggerMonth } from "./date.service";
import { CommonService } from "./common.service";

@Controller()
/**
 * 注入的方式:
 * 1) 通过构造函数参数, 本质是通过ts语法的design:paramtypes来取值
 * 2) 通过Inject注入
 */
export class AppController {
  constructor(
    private readonly LoggerYear: LoggerYear,
    private readonly LoggerMonth: LoggerMonth,
    private readonly CommonService: CommonService,
    @Inject("UseValueLoggerDate") private readonly loggerDate,
    @Inject("UseFactoryLoggerMessage") private readonly loggerMessage,
    @Inject("flag") private readonly flag: string
  ) {}

  @Get("/flag")
  getFlag() {
    return this.flag;
  }

  @Get("/year")
  getYear() {
    return this.LoggerYear.getYear();
  }

  @Get("/month")
  getMonth() {
    return this.LoggerMonth.getMonth();
  }

  @Get("/day")
  getDay() {
    return this.loggerDate.getDay();
  }

  @Get("/message")
  getMessage() {
    return this.loggerMessage.log();
  }

  @Get("/string")
  getString() {
    return this.CommonService.showValueType(777);
  }
}
