import { NestFactory } from "@nestjs/core";

// import { AppModule } from "./demo/controller-demo/app.module"; 调试controller功能
import { AppModule } from "./demo/params-demo/app.module"; // 调试参数装饰器的功能
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
}

bootstrap();
