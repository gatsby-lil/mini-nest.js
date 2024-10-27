import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";
import { validate as isUUID } from "uuid";

export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not a valid UUID.`
      );
    }
    return value;
  }
}
