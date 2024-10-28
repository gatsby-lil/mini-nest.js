import "reflect-metadata";
import { setMetaData } from "@nestjs/common";
export function Roles(...roles: string[]) {
  return setMetaData("roles", roles);
}
