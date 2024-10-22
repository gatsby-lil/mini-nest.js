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
  Session,
  Res,
  Response,
  Next,
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

  @Get("/session")
  getCatsSession(@Session() session) {
    console.log(session, "session");
    return "session";
  }

  @Get("res")
  getCatsResponse(@Res() res) {
    // console.log(res, "res");
    res.send("Hello i am Res");
    return "res";
  }

  @Get("passthrough")
  getCatsPassthrough(
    @Response({
      passthrough: true,
    })
    passthrough
  ) {
    console.log(passthrough, "passthrough");
    return "passthrough";
  }

  @Get("next")
  getCatsNext(@Next() next) {
    next("123-next-cats");
    return "Next";
  }
}
