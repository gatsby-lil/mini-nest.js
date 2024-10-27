import { NestFactory } from "@nestjs/core";
// 调试controller功能
// import { AppModule } from "./demo/controller-demo/app.module";
// 调试参数装饰器的功能、以及http请求的相关方法装饰器
// import { AppModule } from "./demo/params-demo/app.module";
// 调试 Providers
// import { AppModule } from "./demo/provider-demo/app.module";
// 调试 Module
// import { AppModule } from "./demo/module-demo/app.module";
// 调试 midleware
// import { AppModule } from "./demo/middleware-demo/app.module";
// 调试 Exceptionfilters
// import { AppModule } from "./demo/filters-demo/app.module";
// 调试Pipe
import { AppModule } from "./demo/pipe-demo/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
}

bootstrap();
