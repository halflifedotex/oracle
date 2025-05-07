import { Test, TestingModule } from '@nestjs/testing';
import { OracleGateway } from './oracle.gateway';
import { OracleService } from './oracle.service';

describe('OracleGateway', () => {
  let gateway: OracleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleGateway, OracleService],
    }).compile();

    gateway = module.get<OracleGateway>(OracleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
