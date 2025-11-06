import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test.user.${timestamp}@example.com`;
  }

  static generateUserData() {
    return {
      gender: faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: this.generateRandomEmail(),
      company: faker.company.name(),
      password: 'Test@123456',
      confirmPassword: 'Test@123456',
    };
  }

  static generateAddress() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: this.generateRandomEmail(),
      company: faker.company.name(),
      country: 'United States',
      city: faker.location.city(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      zipCode: faker.location.zipCode('#####'),
      phoneNumber: faker.phone.number('###-###-####'),
    };
  }

  static generateInvalidEmail(): string {
    return `invalid-email-${Date.now()}`;
  }

  static generateWeakPassword(): string {
    return '123';
  }
}
