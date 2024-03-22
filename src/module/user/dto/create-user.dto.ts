// create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsDate, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password too weak! It must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.',
  })
  password: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;
}
