import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";
export class ParseFloatPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseFloat(value);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a float.`
      );
    }
    return val;
  }
}
