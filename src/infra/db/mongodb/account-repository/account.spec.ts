import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helpers'
import { AccountMongoRepository } from './account'

const makeSut = (): { sut: AccountMongoRepository } => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

describe('Account Mongo Repository', () => {
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
    const { sut } = makeSut()
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
