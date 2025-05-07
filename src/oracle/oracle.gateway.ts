import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { OracleService } from './oracle.service';
import { CreateOracleDto } from './dto/create-oracle.dto';
import { UpdateOracleDto } from './dto/update-oracle.dto'
@WebSocketGateway()
export class OracleGateway {
  constructor(private readonly oracleService: OracleService) {}

  @SubscribeMessage('createOracle')
  create(@MessageBody() createOracleDto: CreateOracleDto) {
    return this.oracleService.create(createOracleDto);
  }
  @SubscribeMessage('getMetrics')
  getMetrics() {
    return this.oracleService.getMetrics();
  }
}
