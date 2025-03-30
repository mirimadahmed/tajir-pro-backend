import { Database } from '@adonisjs/lucid/database'
import User from '#models/user'
import { assert } from '@japa/assert'
import { ApiResponse } from '@japa/api-client'

declare module '@japa/api-client' {
  interface ApiResponse {
    assertJSONSubset(expected: any): void
  }
}

ApiResponse.prototype.assertJSONSubset = function (expected: any) {
  const actual = this.body()
  Object.keys(expected).forEach((key) => {
    if (typeof expected[key] === 'object' && expected[key] !== null) {
      this.assertJSONSubset(expected[key])
    } else {
      assert.deepEqual(actual[key], expected[key])
    }
  })
}

export { Database, User, assert } 