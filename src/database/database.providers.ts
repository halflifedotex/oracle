import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
        useFactory: (configService: ConfigService<EnvironmentVariables, true>) => {;
          
        return {
          dialect: 'postgres',
          uri: configService.get('DATABASE_URL', { infer: true }),
          autoLoadModels: true,
          synchronize: true, // Be careful with this in production
          logging: configService.get('NODE_ENV', { infer: true }) === 'development',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false // You might want to set this to true in production
            },
            connectTimeout: 30000, // 30 seconds
            statement_timeout: 30000, // 30 seconds
          },
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        };
      },
    }),
  ],
})
export class DatabaseModule { } 
