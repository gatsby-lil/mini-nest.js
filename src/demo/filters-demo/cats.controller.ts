import {
  Controller,
  ForbiddenException,
  Get,
  UseFilters,
} from "@nestjs/common";
import { CustomExceptionFilter } from "./custom-exception.filter";

@Controller("/cats")
export class Cats {
  @Get("/usefilters")
  @UseFilters(CustomExceptionFilter)
  getUseFilters() {
    throw new ForbiddenException("错误", "暂无权限");
  }
}
