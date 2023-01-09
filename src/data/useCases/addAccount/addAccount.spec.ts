import { DBAddAccount } from './dbAddAccount'

class EncryptStub {
  async encrypt (value: string): Promise<string> {
    return await new Promise((resolve) => { resolve('hashed_password') })
  }
}

describe('DBAddAccount UseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const encryptStub = new EncryptStub()
    const sut = new DBAddAccount(encryptStub)
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
