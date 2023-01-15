import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  it('should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }
    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.name).toEqual(accountData.name)
    expect(account.email).toEqual(accountData.email)
    expect(account.password).toEqual(accountData.password)
  })
})
