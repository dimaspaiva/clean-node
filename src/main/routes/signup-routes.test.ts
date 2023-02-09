import request from 'supertest'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers'
import app from '../config/app'
import env from '../config/env'

describe('Signup Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
      .expect(201)
  })
})
