export class CommonService {
  showValueType(value: any): string {
    const valueType = typeof value;
    return `value is ${valueType}`;
  }
  reversalArray(value: any[]) {
    return value.reverse().join("@");
  }
}
