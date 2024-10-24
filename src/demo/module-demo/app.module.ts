import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CoreModule } from "./core.module";
import { OtherModule } from "./other.module";
import { CommonModule } from "./common.module";

@Module({
  imports: [CommonModule, OtherModule],
  controllers: [AppController],
})
export class AppModule {}
