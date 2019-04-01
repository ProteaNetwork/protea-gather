import { Injectable, Inject, Req, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from 'winston';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas, Modules } from 'src/app.constants';
import { ethers } from 'ethers';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService {


  constructor(@InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>,
              @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
              @Inject(Modules.Logger) private readonly logger: Logger,
              private readonly config: ConfigService) { }

  async create(ethAddress: string): Promise<UserDocument> {
    const newUser = await new this.userRepository({ethAddress});
    return newUser.save();
  }

  async getUserByEthAddress(ethAddress: string): Promise<UserDocument> {
    return this.userRepository.findOne({ethAddress});
  }

  async findById(userId: string): Promise<UserDocument> {
    return await this.userRepository.findById(userId);
  }
}
