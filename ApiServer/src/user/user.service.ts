import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from 'winston';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas, Modules } from 'src/app.constants';
import { ConfigService } from '../config/config.service';
import { UserDTO } from './dto/user.dto';
import { AttachmentService } from 'src/attachments/attachment.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>,
    private readonly attachmentService: AttachmentService)
  { }

  async create(ethAddress: string): Promise<UserDocument> {
    const newUser = await new this.userRepository({ethAddress});
    return newUser.save();
  }

  async getUserByEthAddress(ethAddress: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ethAddress: ethAddress.toLowerCase()});
    return user ? user.toObject() : false;
  }

  async updateUserProfile(userData: UserDTO, profileImage): Promise<UserDocument>{
    const user = await this.userRepository.findOne({ethAddress: userData.ethAddress.toLowerCase()});

    if(user) {
      user.displayName = userData.displayName;
      if(profileImage){
        const attachment = await this.attachmentService.create({
          filename: `${userData.ethAddress.toLowerCase()}-${profileImage.originalname}`,
          contentType: profileImage.mimetype
        }, profileImage);
        user.profileImage = attachment;
      }
      user.save();
      return user.toObject();
    }
  }

  async findById(userId: string): Promise<UserDocument> {
    return await this.userRepository.findById(userId);
  }
}
