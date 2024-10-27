import { PipeTransform } from "@nestjs/types";
export class DefaultValuePipe implements PipeTransform {
  constructor(private readonly defaultValue: any) {}

  transform(value: any): any {
    return value !== undefined ? value : this.defaultValue;
  }
}
