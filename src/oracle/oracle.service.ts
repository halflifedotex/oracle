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
    const metrics = await Moralis.EvmApi.token.getTokenPrice({
      address: "0x7fE0244A02630C7cf649c07339aCceCc6f2976b4",
      chain: EvmChain.BASE.hex
    });
    return { message: `Metrics from ${EvmChain.BASE.name}`, data: metrics };
  }
}
