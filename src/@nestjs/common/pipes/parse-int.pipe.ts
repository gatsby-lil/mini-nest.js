import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";

export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not an integer.`
      );
    }
    return val;
  }
}
