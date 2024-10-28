import "reflect-metadata";
import { setMetaData } from "@nestjs/common";
export class Reflector {
  get(metadataKey, target, key?) {
    return key
      ? Reflect.getMetadata(metadataKey, target, key)
      : Reflect.getMetadata(metadataKey, target);
  }
  static createDecorator() {}
}
