import { faker } from '@faker-js/faker'
import User from '#models/user'
import { DateTime } from 'luxon'

export class UserFactory {
  private static defaultAttributes = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'password123',
    role: 'business_owner' as const,
    isVerified: true,
    emailVerifiedAt: DateTime.now(),
  }

  public static async create(overrides: Partial<User> = {}) {
    const user = await User.create({
      ...this.defaultAttributes,
      ...overrides,
    })

    return user
  }

  public static async merge(overrides: Partial<User> = {}) {
    return {
      ...this.defaultAttributes,
      ...overrides,
    }
  }
} 