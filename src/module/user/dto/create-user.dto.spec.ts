import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const validData: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'dgfWreer@ssw0rd123!',
      dateOfBirth: new Date('1990-01-01'),
    };

    const errors = await validate(validData);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if firstName is empty', async () => {
    const invalidData: CreateUserDto = {
      firstName: '', // empty firstName
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'StrongP@ssw0rd123!',
      dateOfBirth: new Date('1990-01-01'),
    };

    const ofImportDto = plainToInstance(CreateUserDto, invalidData);
    const errors = await validate(ofImportDto);
    expect(errors.length).not.toBe(0);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  
  });

  describe('CreateUserDto', () => {
    it('should fail validation if email format is invalid', async () => {
      const invalidData: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'invalidemail', // invalid email format
        password: 'StrongP@ssw0rd123!',
        dateOfBirth: new Date('1990-01-01'),
      };
  
      const ofImportDto = plainToInstance(CreateUserDto, invalidData);
      const errors = await validate(ofImportDto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.isEmail).toBeDefined();
    });
  
    it('should fail validation if password is too short', async () => {
      const invalidData: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'john.doe@example.com',
        password: 'Short1!', // password too short
        dateOfBirth: new Date('1990-01-01'),
      };
  
      const ofImportDto = plainToInstance(CreateUserDto, invalidData);
      const errors = await validate(ofImportDto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.minLength).toBeDefined();
    });
  
    it('should fail validation if dateOfBirth is empty', async () => {
      const invalidData: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'john.doe@example.com',
        password: 'StrongP@ssw0rd123!',
        dateOfBirth: null, // empty dateOfBirth
      };
  
      const ofImportDto = plainToInstance(CreateUserDto, invalidData);
      const errors = await validate(ofImportDto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.isNotEmpty).toBeDefined();
    });
  });
  // Add more test cases for other validation rules
});
