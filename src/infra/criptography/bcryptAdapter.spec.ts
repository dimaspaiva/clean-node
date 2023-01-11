import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

describe('Bcrypt adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const SALT = 12
    const sut = new BcryptAdapter(SALT)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')

    const textToEncrypt = 'some value'
    await sut.encrypt(textToEncrypt)
    expect(encryptSpy).toBeCalledWith(textToEncrypt, SALT)
  })
})
