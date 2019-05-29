import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import { format, transports } from 'winston';
import * as mongodbUri from 'mongodb-uri';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AttachmentModule as AttachmentModule } from './attachments/attachment.module';
import { EventModule } from './event/event.module';
import { CommunityModule } from './community/community.module';
import { EthersProviderModule } from './ethersProvider/ethersProvider.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorModule } from './errorReporting/error.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [ConfigModule,
    EthersProviderModule,
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transports: [
          new transports.Console({
            level: configService.get('log').level,
            handleExceptions: false,
            format: format.combine(format.prettyPrint(), format.cli()),
          }),
          new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.combine(format.json()),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: mongodbUri.formatMongoose(configService.get('mongodb')),
        useCreateIndex: true,
        useNewUrlParser: true,
        bufferCommands: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AttachmentModule,
    EventModule,
    CommunityModule,
    ErrorModule,
    FeedbackModule
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class ApplicationModule { }
