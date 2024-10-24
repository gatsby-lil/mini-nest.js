import { NestFactory } from "@nestjs/core";
// 调试controller功能
// import { AppModule } from "./demo/controller-demo/app.module";
// 调试参数装饰器的功能、以及http请求的相关方法装饰器
// import { AppModule } from "./demo/params-demo/app.module";
// 调试Providers
// import { AppModule } from "./demo/provider-demo/app.module";
// 调试Module
import { AppModule } from "./demo/module-demo/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
}

bootstrap();
