import { Param, ParseIntPipe } from "@nestjs/common";
import { Controller, Get } from "@nestjs/common";

@Controller("pipe")
export class AppController {
  @Get("/number/:id")
  getNumber(@Param("id", ParseIntPipe) id: number) {
    console.log(id);
    return id;
  }
}
