import { ValidationError, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ArgumentMetadata, PipeTransform } from "@nestjs/types";
import { BadRequestException } from "@nestjs/common";

export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.needValidate(metatype)) {
      return value;
    }

    const instance = plainToInstance(metatype, value);
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return value;
  }
  formatErrors(errors: ValidationError[]) {
    return errors
      .map((error) => {
        for (const property in error.constraints) {
          return `${error.property} - ${error.constraints[property]}`;
        }
      })
      .join(",");
  }
  needValidate(metatype: Function): boolean {
    const types: Function[] = [String, Number, Boolean, Array, Object];
    return !types.includes(metatype);
  }
}
