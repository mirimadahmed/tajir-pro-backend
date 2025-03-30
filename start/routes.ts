/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'

// Auth routes
router
  .group(() => {
    router.post('signup', [AuthController, 'signup'])
    router.post('login', [AuthController, 'login'])
    router.get('verify-email', [AuthController, 'verifyEmail'])
  })
  .prefix('api/auth')

// Protected routes
router
  .group(() => {
    router.post('logout', [AuthController, 'logout'])
    router.get('me', [AuthController, 'me'])
  })
  .prefix('api/auth')
  .use(middleware.auth())

// Health check route
router.get('/', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})
