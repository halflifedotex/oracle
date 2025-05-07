import { Logger, Module } from '@nestjs/common';
import { OracleService } from './oracle.service';
import { OracleGateway } from './oracle.gateway';

@Module({
  providers: [OracleGateway, OracleService, Logger],
})
export class OracleModule {}
