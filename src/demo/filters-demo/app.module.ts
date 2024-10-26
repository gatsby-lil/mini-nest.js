import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { Cats } from "./cats.controller";

@Module({
  controllers: [AppController, Cats],
  providers: [
    {
      provide: "PREFIX",
      useValue: "PREFIX",
    },
  ],
  exports: ["PREFIX"],
})
export class AppModule {}
