import { NestFactory } from "@nestjs/core";
// import session from "express-session";
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
  // 测试@Session
  // app.use(
  //   session({
  //     secret: "your-secret-key", //用于加密会话的密钥
  //     resave: false, //在每次请求结束后是否强制保存会话，即使它没有改变
  //     saveUninitialized: false, //是否保存未初始化的会话
  //     cookie: { maxAge: 1000 * 60 * 60 * 24 }, //定义会话的cookie配置，设置cookie的最大存活时间是一天
  //   })
  // );
  app.listen(3000);
}

bootstrap();
