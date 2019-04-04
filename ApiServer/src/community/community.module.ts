import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttachmentModule } from '../attachments/attachment.module';
import { Schemas } from 'src/app.constants';
import { CommunitySchema } from './community.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Community, schema: CommunitySchema}]),
    AttachmentModule
  ],
  providers: [CommunityService],
  controllers: [CommunityController]
})
export class CommunityModule {}
