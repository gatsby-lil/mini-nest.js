import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";
export class ParseEnumPipe implements PipeTransform<string, any> {
  constructor(private readonly enumType: any) {}
  transform(value: string): any {
    const enumValues = Object.values(this.enumType);
    if (!enumValues.includes(value)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a valid enum value.`
      );
    }
    return value;
  }
}
