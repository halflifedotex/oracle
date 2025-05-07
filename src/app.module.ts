import { Module } from '@nestjs/common';
import { OracleModule } from './oracle/oracle.module';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => environmentSchema.parse(config),
    }),
    OracleModule,
  ],
})
export class AppModule {}
