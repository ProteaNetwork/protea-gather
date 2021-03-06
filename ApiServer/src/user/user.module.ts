import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { Schemas } from '../app.constants';
import { AttachmentModule } from 'src/attachments/attachment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.User, schema: UserSchema }]),
    AttachmentModule
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})

export class UsersModule { }
