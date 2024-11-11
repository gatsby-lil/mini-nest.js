import { Controller, Get } from "@nestjs/common";

@Controller()
export class PayController {
  @Get("/pay")
  getPay() {
    return "pay";
  }
}
