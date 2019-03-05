import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { Logger } from 'winston';
import { Modules } from './app.constants';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService,
              @Inject(Modules.Logger) private readonly logger: Logger) {}

  root(): any {
    this.logger.log('info', 'Request to root received');
    const app = this.config.get('app');
    return {
      name: app.name,
      version: app.version,
      description: app.description,
    };
  }
}
