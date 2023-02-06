import request from 'supertest'

import app from '../config/app'

describe('Signup Route', () => {
  it('should return an account on success', async () => {
    const testUser = {
      name: 'test user',
      email: 'test@mail.com',
      password: 'test-password',
      passwordConfirmation: 'test-password'
    }

    await request(app)
      .post('/signup')
      .send(testUser)
      .expect(200)
  })
})
