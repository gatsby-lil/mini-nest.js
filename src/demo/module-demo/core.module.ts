import { Module } from "@nestjs/common";
import { CommonModule } from "./common.module";

@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
