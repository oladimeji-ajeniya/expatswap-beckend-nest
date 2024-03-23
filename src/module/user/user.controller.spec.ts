import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  const mockUsers: User[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'P@ssw0rd',
      dateOfBirth: new Date('1990-01-01'),
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '0987654321',
      email: 'jane.smith@example.com',
      password: 'S3cur3P@ss',
      dateOfBirth: new Date('1985-05-15'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'john',
        lastName: 'doe',
        phoneNumber: '1234',
        email: 'jon@test.com',
        password: 'ererewr',
        dateOfBirth: 'efwwfer'
      };
      const createdUser: User = {
        firstName: 'john',
        lastName: 'doe',
        phoneNumber: '1234',
        email: 'jon@test.com',
        password: 'ererewr',
        dateOfBirth: new Date()
      };
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw HttpStatus.BAD_REQUEST if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'john',
        lastName: 'doe',
        phoneNumber: '1234',
        email: 'jon@test.com',
        password: 'ererewr',
        dateOfBirth: new Date()
      };
      const errorMessage = 'User creation failed';
      jest.spyOn(userService, 'createUser').mockRejectedValue(new Error(errorMessage));

      await expect(controller.createUser(createUserDto)).rejects.toThrowError(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with default pagination values', async () => {
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue({ users: mockUsers, total: mockUsers.length });
    
      const result = await controller.getAllUsers();
    
      expect(result).toEqual({ users: mockUsers, total: mockUsers.length });
      expect(userService.findAllUsers).toHaveBeenCalledWith(1, 10, null, null);
    });
  
    it('should return all users with custom pagination values', async () => {
      const fromDate = '2022-01-01';
      const toDate = '2023-01-01';
      const page = 2;
      const limit = 5;
    
      // Demo user data
      const mockUsers: User[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john.doe@example.com',
          password: 'P@ssw0rd',
          dateOfBirth: new Date('1990-01-01'),
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '0987654321',
          email: 'jane.smith@example.com',
          password: 'S3cur3P@ss',
          dateOfBirth: new Date('1985-05-15'),
        },
      ];
      const mockTotal = mockUsers.length;
    
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue({ users: mockUsers, total: mockTotal });
    
      const result = await controller.getAllUsers(fromDate, toDate, page, limit);
    
      expect(result).toEqual({ users: mockUsers, total: mockTotal });
      expect(userService.findAllUsers).toHaveBeenCalledWith(page, limit, new Date(fromDate), new Date(toDate));
    });
  
    it('should throw HttpStatus.INTERNAL_SERVER_ERROR if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      jest.spyOn(userService, 'findAllUsers').mockRejectedValue(new Error(errorMessage));
  
      await expect(controller.getAllUsers()).rejects.toThrowError(new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
  
  describe('userExists', () => {
    it('should return exists:true if user exists', async () => {
      const email = 'test@example.com';
      const existingUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'P@ssw0rd',
        dateOfBirth: new Date('1990-01-01'),
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser);
    
      const result = await controller.userExists(email);
    
      expect(result).toEqual({ exists: true });
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  
    it('should return exists:false if user does not exist', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
  
      const result = await controller.userExists(email);
  
      expect(result).toEqual({ exists: false });
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  
    it('should throw HttpStatus.INTERNAL_SERVER_ERROR if an error occurs', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Internal server error';
      jest.spyOn(userService, 'findByEmail').mockRejectedValue(new Error(errorMessage));
  
      await expect(controller.userExists(email)).rejects.toThrowError(new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
  
});
