import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Modules, Schemas } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityDocument } from './community.schema';
import { CommunityDTO } from './dto/community.dto';
import { AttachmentService } from 'src/attachments/attachment.service';
import { ObjectId } from 'bson';

@Injectable()
export class CommunityService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.Community) private readonly communityRepository: Model<CommunityDocument>,
    private readonly attachmentService: AttachmentService) {

  }

  async getCommunityByTbcAddress(tbcAddress: string, networkId: number): Promise<CommunityDocument> {
    const doc = await this.communityRepository.findOne({ tbcAddress, networkId });
    return doc ? doc.toObject() : false;
  }

  async createCommunity(createData: CommunityDTO, networkId: number, bannerImage): Promise<CommunityDocument | HttpException> {
    const communityDoc = await new this.communityRepository(createData);
    communityDoc.networkId = networkId;
    if(bannerImage){
      const attachment = await this.attachmentService.create({
        filename: `${createData.tbcAddress}-${bannerImage.originalname}`,
        contentType: bannerImage.mimetype
      }, bannerImage);
      communityDoc.bannerImage = attachment;
    }


    communityDoc.save();
    return communityDoc.toObject();
  }

  async updateCommunity(tbcAddress: string, networkId: number, communityData: CommunityDTO, bannerImage): Promise<CommunityDocument> {
    const communityDoc = await this.communityRepository.findOne({ tbcAddress: tbcAddress, networkId: networkId });
    Object.keys(communityData).forEach(key => {
      communityDoc[key] = communityData[key];
    });

    if (bannerImage) {
      this.attachmentService.delete(communityDoc.bannerImage);
      const attachment = await this.attachmentService.create({
        filename: `${communityDoc.tbcAddress}-${bannerImage.originalname}`,
        contentType: bannerImage.mimetype
      }, bannerImage);
      communityDoc.bannerImage = attachment;
    }

    communityDoc.save();
    return communityDoc.toObject();
  }
}
