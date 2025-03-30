import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

export default defineConfig({
  default: 'smtp',
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'smtp.mailtrap.io'),
      port: env.get('SMTP_PORT', '2525'),
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME', 'test'),
        pass: env.get('SMTP_PASSWORD', 'test'),
      },
    }),
  },
}) 