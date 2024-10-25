import { DynamicModule, Module } from "@nestjs/common";

@Module({})
export class DynamicConfigModule {
  static forRoot(): DynamicModule {
    const providers = [
      {
        provide: "CONFIG",
        useValue: { databaseKey: "admin888" },
      },
    ];
    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map((provider) =>
        provider instanceof Function ? provider : provider.provide
      ),
    };
  }
}
