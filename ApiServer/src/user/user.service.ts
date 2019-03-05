import { Injectable, Inject, Req, NotImplementedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Logger } from 'winston';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas, Modules } from 'src/app.constants';
import { ethers } from 'ethers';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UsersService {

  constructor(@InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>,
              @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
              @Inject(Modules.Logger) private readonly logger: Logger,
              private readonly config: ConfigService) { }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    throw new NotImplementedException();
  }
}
