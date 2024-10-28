import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { Roles } from "./roles.decorator";

@Controller("accounts")
export class AccountController {
  @Get()
  @UseGuards(AuthGuard)
  @Roles("admin", "superAdmin")
  getAccount() {
    return "account";
  }
}
