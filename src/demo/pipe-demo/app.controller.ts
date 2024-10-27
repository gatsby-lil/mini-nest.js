import {
  Body,
  Param,
  ParseIntPipe,
  Post,
  Controller,
  Get,
  UsePipes,
} from "@nestjs/common";

import { CustomPipe } from "./custom.pipe";
import { CreateUserDto } from "./create-user.dto";
import { ValidationPipe } from "./class-validation.pipe";

@Controller("pipe")
export class AppController {
  @Get("/number/:id")
  getNumber(@Param("id", ParseIntPipe) id: number) {
    console.log(id);
    return id;
  }
  @Get("/custom/:value")
  getCustom(@Param("value", CustomPipe) value: string) {
    return `value: ${value}`;
  }
  @Post("/create")
  @UsePipes(new ValidationPipe())
  createUser(@Body() createBody: CreateUserDto) {
    console.log(createBody, "createBody");
    return createBody;
  }
}
