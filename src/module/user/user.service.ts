// users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<any>) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { password, ...rest } = createUserDto;
    const saltRounds = 10; // Number of salt rounds for bcrypt

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const createdUser = new this.userModel({ ...rest, password: hashedPassword });
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException('Could not create user');
    }
  }

  async findAllUsers(page: number = 1, limit: number = 10, fromDate: Date = null, toDate: Date = null): Promise<{ users: any[], total: number }> {
    const pipeline = [];

    if (fromDate && toDate) {
      pipeline.push({ $match: { dateOfBirth: { $gte: fromDate, $lte: toDate } } });
    } else if (fromDate) {
      pipeline.push({ $match: { dateOfBirth: { $gte: fromDate } } });
    } else if (toDate) {
      pipeline.push({ $match: { dateOfBirth: { $lte: toDate } } });
    }

    pipeline.push(
      { $facet: {
          users: [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ],
          total: [
            { $count: 'total' }
          ]
        }
      }
    );

    const result = await this.userModel.aggregate(pipeline).exec();

    return { users: result[0].users, total: result[0].total.length ? result[0].total[0].total : 0 };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}


