import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService,
              @Inject('winston') private readonly logger: Logger) {}

  root(): any {
    this.logger.log({ level: 'info',
      message: 'in Root handler'});

    return {
      name: this.config.get('app').name,
      version: this.config.get('app').version,
      description: this.config.get('app').description,
    };
  }
}
