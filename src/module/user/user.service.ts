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


  async findAllUsers(
    page: number = 1,
    limit: any = 10,
    fromDate: Date = null,
    toDate: Date = null
  ): Promise<{ users: any[], total: number }> {
    const query: any = {};
  
    if (fromDate && toDate) {
      query.dateOfBirth = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.dateOfBirth = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.dateOfBirth = { $lte: new Date(toDate) };
    }
  
    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  
    const total = await this.userModel.countDocuments(query).exec();
  
    return { users, total };
  }
  
  
  

formatDate(date: Date): string {
    if (!date) {
        return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || null; 
  }


}
