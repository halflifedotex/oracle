import { Module } from '@nestjs/common';
import { OracleModule } from './oracle/oracle.module';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => environmentSchema.parse(config)
    }),
    DatabaseModule,
    OracleModule
  ],
})
export class AppModule {}
