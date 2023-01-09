import { Encrypter } from '../../protocols/encrypter'
import { DBAddAccount } from './dbAddAccount'

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('hashed_password') })
    }
  }

  return new EncryptStub()
}

interface SutTypes {
  encrypterStub: Encrypter
  sut: DBAddAccount
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DBAddAccount(encrypterStub)

  return {
    encrypterStub,
    sut
  }
}

describe('DBAddAccount UseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  it('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    const sutPromise = sut.add(accountData)
    await expect(sutPromise).rejects.toThrow()
  })
})
