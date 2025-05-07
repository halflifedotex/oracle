import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, WsResponse, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OracleService } from './oracle.service';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8000)
export class OracleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly oracleService: OracleService, private readonly logger: Logger) { }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
  }
  @SubscribeMessage('metrics')
  getMetrics(): WsResponse<any> {
    return {
      event: 'metrics',
      data: this.oracleService.getMetrics(),
    };
  }
}
