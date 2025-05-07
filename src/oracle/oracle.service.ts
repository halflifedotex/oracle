import { Injectable, OnModuleInit } from '@nestjs/common';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';

@Injectable()
export class OracleService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  async onModuleInit() {
    const apiKey = this.configService.get('MORALIS_API_KEY', { infer: true });
    if (!apiKey) {
      throw new Error('MORALIS_API_KEY is not defined in environment variables');
    }
    await Moralis.start({ apiKey });
    console.log('Moralis SDK Started');
  }

  async getMetrics() {
    const chainName = this.configService.get('CHAIN', { infer: true });
    if (!chainName) {
      throw new Error('CHAIN is not defined in environment variables');
    }

    const chainKeys = Object.keys(EvmChain) as (keyof typeof EvmChain)[];
    if (!chainKeys.includes(chainName as keyof typeof EvmChain)) {
      throw new Error(`Invalid chain: ${chainName}. Valid chains are: ${chainKeys.join(', ')}`);
    }
    
    const chain = EvmChain[chainName as keyof typeof EvmChain];

    return { message: `Metrics from ${chain.name}` };
  }
}
