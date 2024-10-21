import { Controller, Get } from "@nestjs/common";

@Controller("/cats")
export class AppController {
  @Get()
  getCats() {
    return "cats";
  }
}
