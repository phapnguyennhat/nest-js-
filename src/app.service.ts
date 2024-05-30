import { DevConfigService } from './common/providers/DevConfigService';
import { Get, Inject, Injectable, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG') private config: { port: string },
  ) {}

  getHello(): string {
    return `Hello I am learning Nest.js Fundamentals ${this.devConfigService.getDBHOST()} and port is ${this.config.port}`;
  }
}
