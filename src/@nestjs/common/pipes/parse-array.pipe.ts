import { BadRequestException } from "@nestjs/common";
import { PipeTransform } from "@nestjs/types";

interface ParseArrayPipeOptions {
  items: any;
  separator?: string;
}

export class ParseArrayPipe implements PipeTransform<string, any[]> {
  constructor(private readonly options: ParseArrayPipeOptions) {}

  transform(value: string): any[] {
    if (!value) {
      return [];
    }

    const { items, separator = "," } = this.options;
    const values = value.split(separator).map((item) => {
      if (items === String) {
        return item;
      } else if (items === Number) {
        const val = Number(item);
        if (isNaN(val)) {
          throw new BadRequestException(
            `Validation failed. "${item}" is not a number.`
          );
        }
        return val;
      } else if (items === Boolean) {
        if (item.toLowerCase() === "true") {
          return true;
        } else if (item.toLowerCase() === "false") {
          return false;
        } else {
          throw new BadRequestException(
            `Validation failed. "${item}" is not a boolean.`
          );
        }
      }
    });

    return values;
  }
}
