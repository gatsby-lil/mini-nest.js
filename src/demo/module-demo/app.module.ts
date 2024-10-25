import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CoreModule } from "./core.module";
import { OtherModule } from "./other.module";
import { CommonModule } from "./common.module";
import { DynamicConfigModule } from "./dynamicConfig.module";
import { AppService } from "./app.service";

@Module({
  imports: [CommonModule, OtherModule, DynamicConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
