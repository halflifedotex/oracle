import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ExecutionContext } from '@nestjs/common';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  
  await app.init();
  
  return expressApp;
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const app = await bootstrap();
    
    // Create Express request and response objects
    const req = express.request as ExpressRequest;
    const res = express.response as ExpressResponse & { body?: any };
    
    // Copy request properties
    req.method = request.method;
    req.url = request.url;
    req.headers = Object.fromEntries(new Headers(request.headers));
    req.body = await request.clone().text();
    
    // Handle the request
    return new Promise((resolve) => {
      app(req, res, () => {
        const headers = new Headers();
        Object.entries(res.getHeaders()).forEach(([key, value]) => {
          headers.set(key, String(value));
        });
        
        resolve(new Response(res.body?.toString(), {
          status: res.statusCode,
          headers,
        }));
      });
    });
  },
}; 