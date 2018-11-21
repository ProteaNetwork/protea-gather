import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Logger } from 'winston';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userRepository: Model<UserDocument>,
              @Inject('winston') private readonly logger: Logger) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const createdUser = new this.userRepository(createUserDto);
    return await createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userRepository.findOne({ email });
  }

  async findById(userId: string): Promise<UserDocument> {
    return await this.userRepository.findById(userId);
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userRepository.find().populate('Organization');
  }
}
