import {
  Controller,
  Get,
  Req,
  Request,
  Query,
  Post,
  Body,
  Ip,
  Param,
  Headers,
} from "@nestjs/common";

@Controller("/cats")
export class AppController {
  @Get()
  getCats(@Req("method") reqMethod, @Request() request) {
    console.log(reqMethod, "reqMethod");
    return request.method + "cats";
  }

  @Get("/queryuser")
  getCatsQuery(@Query() query, @Query("userName") userName) {
    console.log(query);
    return userName;
  }

  @Post("/create")
  createCats(@Body("id") identity, @Body() body) {
    console.log(body, "body");
    return identity;
  }

  @Get("/params/:id/:catname")
  getCatParams(@Param() param, @Param("catname") catname) {
    console.log(param, "param"); // { id: '123' }
    return catname;
  }

  @Get("/ip")
  getCatsIp(@Ip() ip) {
    return ip;
  }

  @Post("/update")
  updateCats(@Headers() headers, @Headers("key1") key1) {
    console.log(headers);
    return "headers" + key1;
  }
}
