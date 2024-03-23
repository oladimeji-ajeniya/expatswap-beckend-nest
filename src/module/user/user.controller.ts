// users.controller.ts
import { Controller, Get, Post, Body, HttpStatus, HttpException, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Apply validation pipe
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllUsers(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: User[], total: number }> {
    try {
      let fromDateObj: Date | null = null;
      let toDateObj: Date | null = null;

      if (fromDate) {
        fromDateObj = new Date(fromDate);
      }

      if (toDate) {
        toDateObj = new Date(toDate);
      }

      const { users, total } = await this.usersService.findAllUsers(page, limit, fromDateObj, toDateObj);
      return { users, total };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('exists')
  async userExists(@Query('email') email: string): Promise<{ exists: boolean }> {
    try {
      const user = await this.usersService.findByEmail(email);
      return { exists: !!user }; // Return true if user exists, false otherwise
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
