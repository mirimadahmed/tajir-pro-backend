import { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginValidator } from '#validators/auth_validator'
import User from '#models/user'
import { DateTime } from 'luxon'
import { generate } from 'randomstring'
// import mail from '@adonisjs/mail/services/mail'

export default class AuthController {
  /**
   * Register a new user
   */
  async signup({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(signupValidator)
      
      // Check if user already exists
      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.status(400).json({
          success: false,
          message: 'User with this email already exists',
        })
      }

      // Create verification token
      const verificationToken = generate(32)

      // Create user
      const user = await User.create({
        ...payload,
        isVerified: true, // Temporarily set to true for testing
        verificationToken,
      })

      // Temporarily comment out email verification
      /*
      // Send verification email
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Verify your email')
          .htmlView('emails/verify', { user, verificationToken })
      })
      */

      return response.status(201).json({
        success: true,
        message: 'User registered successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Registration failed',
        errors: error.messages,
      })
    }
  }

  /**
   * Login user
   */
  async login({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)

      // Attempt login
      const user = await auth.use('api').attempt(payload.email, payload.password)

      // Check if user is verified
      if (!user.isVerified) {
        return response.status(401).json({
          success: false,
          message: 'Please verify your email before logging in',
        })
      }

      return response.json({
        success: true,
        message: 'Login successful',
        token: user.token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
  }

  /**
   * Logout user
   */
  async logout({ response, auth }: HttpContext) {
    try {
      await auth.use('api').logout()
      return response.json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Logout failed',
      })
    }
  }

  /**
   * Get current user
   */
  async me({ response, auth }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      return response.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }
  }

  /**
   * Verify email
   */
  async verifyEmail({ request, response }: HttpContext) {
    try {
      const { token } = request.qs()
      
      const user = await User.findBy('verificationToken', token)
      if (!user) {
        return response.status(400).json({
          success: false,
          message: 'Invalid verification token',
        })
      }

      // Update user verification status
      user.isVerified = true
      user.verificationToken = null
      user.emailVerifiedAt = DateTime.now()
      await user.save()

      return response.json({
        success: true,
        message: 'Email verified successfully',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Email verification failed',
      })
    }
  }
} 