import { NestFactory } from "@nestjs/core";
import { AppModule } from "./demo/controller-demo/app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
}

bootstrap();