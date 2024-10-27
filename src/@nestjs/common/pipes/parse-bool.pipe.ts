import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";
export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value.toLowerCase() === "true") {
      return true;
    } else if (value.toLowerCase() === "false") {
      return false;
    } else {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a boolean.`
      );
    }
  }
}
