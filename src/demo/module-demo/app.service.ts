import { Inject } from "@nestjs/common";

export class AppService {
  constructor(@Inject("CONFIG") private readonly config) {}
  getDataBaseConfig() {
    console.log(this.config, "config");
    return this.config;
  }
}
