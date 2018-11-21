import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { WinstonModule } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import { format, transports } from 'winston';
import { UsersModule } from './users/users.module';
import * as mongodbUri from 'mongodb-uri';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule,
    WinstonModule.forRoot({
      transports: [
          new transports.Console({
              level: 'info',
              handleExceptions: false,
              format: format.combine(format.json()),
          }),
        ],
      }),
      MongooseModule.forRootAsync({
        useFactory: async (configService: ConfigService) => ({
          uri: mongodbUri.formatMongoose(configService.get('mongodb')),
          useNewUrlParser: true,
          bufferCommands: false,
        }),
        inject: [ConfigService],
      }),
      UsersModule,
      // AuthModule,
    ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class ApplicationModule {}
