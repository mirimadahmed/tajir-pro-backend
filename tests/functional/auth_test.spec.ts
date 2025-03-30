import { test } from '@japa/runner'
import { UserFactory } from '../../database/factories/user_factory.js'
import { Database, User } from '../helpers.js'
import db from '@adonisjs/lucid/services/db'
import { expect } from '@japa/expect'

test.group('Authentication', (group) => {
  let trx: any

  group.each.setup(async () => {
    // Clean up database after each test
    trx = await db.transaction()
    return () => trx.rollback()
  })

  test('should register a new user', async ({ client }) => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      role: 'business_owner',
    }

    const response = await client.post('/api/auth/signup').json(userData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'User registered successfully.',
      user: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    })

    // Verify user was created in database
    const user = await User.findBy('email', userData.email)
    expect(user).toBeDefined()
    expect(user?.name).toBe(userData.name)
    expect(user?.role).toBe(userData.role)
    expect(user?.isVerified).toBe(true)
  })

  test('should not register user with existing email', async ({ client }) => {
    // Create existing user
    const existingUser = await UserFactory.create()

    const userData = {
      name: 'Test User',
      email: existingUser.email,
      password: 'password123',
      password_confirmation: 'password123',
      role: 'business_owner',
    }

    const response = await client.post('/api/auth/signup').json(userData)

    response.assertStatus(400)
    response.assertBodyContains({
      success: false,
      message: 'User with this email already exists',
    })
  })

  test('should login user', async ({ client }) => {
    // Create a user
    const user = await UserFactory.create()

    const loginData = {
      email: user.email,
      password: 'password123',
    }

    const response = await client.post('/api/auth/login').json(loginData)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
    expect(response.body().token).toBeDefined()
  })

  test('should not login with invalid credentials', async ({ client }) => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    }

    const response = await client.post('/api/auth/login').json(loginData)

    response.assertStatus(401)
    response.assertBodyContains({
      success: false,
      message: 'Invalid credentials',
    })
  })

  test('should get current user profile', async ({ client }) => {
    // Create a user
    const user = await UserFactory.create()

    // Login to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: user.email,
      password: 'password123',
    })

    const token = loginResponse.body().token

    // Get user profile
    const response = await client
      .get('/api/auth/me')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  })

  test('should not get profile without token', async ({ client }) => {
    const response = await client.get('/api/auth/me')

    response.assertStatus(401)
    response.assertBodyContains({
      success: false,
      message: 'Unauthorized',
    })
  })

  test('should logout user', async ({ client }) => {
    // Create a user
    const user = await UserFactory.create()

    // Login to get token
    const loginResponse = await client.post('/api/auth/login').json({
      email: user.email,
      password: 'password123',
    })

    const token = loginResponse.body().token

    // Logout
    const response = await client
      .post('/api/auth/logout')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Logged out successfully',
    })

    // Verify token is invalidated
    const profileResponse = await client
      .get('/api/auth/me')
      .header('Authorization', `Bearer ${token}`)

    profileResponse.assertStatus(401)
  })
}) 