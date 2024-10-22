import { createParamDecorator } from "@nestjs/common";

/**
 * 自定义参数装饰器
 */
export const User = createParamDecorator((data, context) => {
  console.log(data, "data");
  console.log(context, "context");
  const { switchToHttp } = context;
  const req = switchToHttp().getRequest();
  if (req) {
    return req.query.userId;
  }
  return "nobody";
});
