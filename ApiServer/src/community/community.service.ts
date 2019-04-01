import { Injectable, Inject } from '@nestjs/common';
import { Modules, Schemas } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityDocument } from './community.schema';
import { CommunityDTO } from './dto/community.dto';

@Injectable()
export class CommunityService {
  constructor(@Inject(Modules.Logger) logger, @InjectModel(Schemas.Community) private readonly communityRepository: Model<CommunityDocument>){

  }

  async getCommunityByTbcAddress(tbcAddress: string): Promise<CommunityDocument> {
    const doc = await this.communityRepository.findOne({tbcAddress});
    // DEBUG used only in populating new instances
    // if(!doc){
    //   const communityDoc = await new this.communityRepository({
    //     tbcAddress: tbcAddress,
    //     membershipManager: "0xb24424e3e8114bc13CBa8B7cBd6270b4dE1e8f71",
    //     eventManager: "0xE6dE965a7D0B81921F2b037470C039B351E8aa43",
    //     name: "community",
    //     tokenSymbol: "COM",
    //   });
    //   communityDoc.save();
    //   return communityDoc.toObject();
    // }
    return doc.toObject();
  }

  async createCommunity(createData: CommunityDTO): Promise<CommunityDocument>{
    const communityDoc = await new this.communityRepository(createData);
    communityDoc.save();
    return communityDoc.toObject();
  }

  async updateCommunity(communityData: CommunityDTO): Promise<CommunityDocument>{
    const doc = await this.communityRepository.findOne({tbcAddress: communityData.tbcAddress});
    Object.keys(communityData).forEach(key => {
      doc[key] = communityData[key];
    });

    doc.save();
    return doc.toObject();
  }
}
