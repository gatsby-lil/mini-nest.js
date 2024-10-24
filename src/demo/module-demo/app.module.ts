import { Module } from "@nestjs/common";
import { DateModule } from "./date.module";
import { AppController } from "./app.controller";

@Module({
  imports: [DateModule],
  controllers: [AppController],
})
export class AppModule {}
