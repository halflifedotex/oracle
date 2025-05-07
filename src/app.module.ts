import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OracleModule } from './oracle/oracle.module';

@Module({
  imports: [OracleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
