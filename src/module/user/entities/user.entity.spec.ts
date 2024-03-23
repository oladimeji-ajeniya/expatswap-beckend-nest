import { User } from "./user.entity";

describe('User Class and Interface', () => {
  it('should create a new instance of User class', () => {
    const userInstance = new User();
    expect(userInstance).toBeDefined();
  });

  it('should have the correct properties in User interface', () => {
    const user: User = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'hhuhRTede^ssw0rd123!',
      dateOfBirth: new Date('1990-01-01'),
    };

    expect(user.firstName).toEqual('John');
    expect(user.lastName).toEqual('Doe');
    expect(user.phoneNumber).toEqual('1234567890');
    expect(user.email).toEqual('john.doe@example.com');
    expect(user.password).toEqual('hhuhRTede^ssw0rd123!');
    expect(user.dateOfBirth).toEqual(new Date('1990-01-01'));
  });
});
