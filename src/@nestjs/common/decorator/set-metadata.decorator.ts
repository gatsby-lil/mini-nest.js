import "reflect-metadata";
export function setMetaData(metadataKey, metadataValue) {
  return function (
    tatget: object | Function,
    propertyKey?: string,
    descriptor?: PropertyDescriptor
  ) {
    if (descriptor.value) {
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, tatget);
    }
  };
}
