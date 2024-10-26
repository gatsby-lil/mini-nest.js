import { HttpException } from "@nestjs/common";
import { Controller, Get } from "@nestjs/common";
import { HttpStatus } from "@nestjs/types";

@Controller()
export class AppController {
  @Get("/exception")
  exception() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: "This is a custom message",
      },
      HttpStatus.FORBIDDEN
    );
  }
}
