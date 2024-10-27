import { Injectable } from "@nestjs/common";
import { ArgumentMetadata, PipeTransform } from "@nestjs/types";

@Injectable()
export class CustomPipe implements PipeTransform {
  transform(value: any, metadata?: ArgumentMetadata) {
    console.log(value, "value");
    console.log(metadata);
    return value;
  }
}
