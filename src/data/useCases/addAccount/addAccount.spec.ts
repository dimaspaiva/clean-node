import { DBAddAccount } from './dbAddAccount'

class EncryptStub {
  async encrypt (value: string): Promise<string> {
    return await new Promise((resolve) => { resolve('hashed_password') })
  }
}

interface SutTypes {
  encryptStub: EncryptStub
  sut: DBAddAccount
}

const makeSut = (): SutTypes => {
  const encryptStub = new EncryptStub()
  const sut = new DBAddAccount(encryptStub)

  return {
    encryptStub,
    sut
  }
}

describe('DBAddAccount UseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encryptStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
