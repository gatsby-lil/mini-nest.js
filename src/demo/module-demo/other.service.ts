import { Injectable } from "@nestjs/common";
import { CommonService } from "./common.service";

@Injectable()
export class OtherService {
  constructor(private c: CommonService) {}
  callReversal() {
    return this.c.reversalArray(["L", 7, "M"]);
  }
}
