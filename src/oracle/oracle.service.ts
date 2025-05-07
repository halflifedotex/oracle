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
      console.error('MORALIS_API_KEY is not defined in environment variables');
      throw new Error('MORALIS_API_KEY is not defined in environment variables');
    }
    try {
      console.log('Attempting to start Moralis SDK...');
      await Moralis.start({ apiKey });
      console.log('Moralis SDK Started successfully.');
    } catch (error) {
      console.error('Failed to start Moralis SDK:', error);
      throw error; // Re-throw the error to ensure NestJS knows the module failed to initialize
    }
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
