import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/logger")
  getLogger() {
    return "日志";
  }
}
