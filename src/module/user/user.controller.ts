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
// http://localhost:3000/user?startDate=&endDate=2024-03-25
@Get()
  async getAllUsers(
    @Query('startDate') startDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: User[], total: number }> {
    try {
      let fromDate: Date | null = null;
      let toDate: Date | null = null;

      if (startDate) {
        fromDate = new Date(startDate);
      }

      if (endDate) {
        toDate = new Date(endDate);
      }

      console.log(fromDate, toDate, 'From controller');

      const { users, total } = await this.usersService.findAllUsers(page, limit, fromDate, toDate);
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
