import { test } from '@japa/runner'
import { UserFactory } from '../../database/factories/user_factory.js'
import { DateTime } from 'luxon'
import { Database, User, assert } from '../helpers.js'
import db from '@adonisjs/lucid/services/db'

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
    assert.exists(user)
    assert.equal(user?.name, userData.name)
    assert.equal(user?.role, userData.role)
    assert.isTrue(user?.isVerified)
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
    assert.exists(response.body().token)
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

  test('should verify email with valid token', async ({ client }) => {
    // Create unverified user with verification token
    const verificationToken = 'valid-token-123'
    const user = await UserFactory.merge({
      isVerified: false,
      verificationToken,
    }).create()

    const response = await client.get(`/api/auth/verify-email?token=${verificationToken}`)

    response.assertStatus(200)
    response.assertJSONSubset({
      success: true,
      message: 'Email verified successfully',
    })

    // Verify user is updated in database
    await user.refresh()
    assert.isTrue(user.isVerified)
    assert.isNull(user.verificationToken)
    assert.exists(user.emailVerifiedAt)
  })

  test('should not verify email with invalid token', async ({ client }) => {
    const response = await client.get('/api/auth/verify-email?token=invalid-token')

    response.assertStatus(400)
    response.assertJSONSubset({
      success: false,
      message: 'Invalid verification token',
    })
  })
}) 