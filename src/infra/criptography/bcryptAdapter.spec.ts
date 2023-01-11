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

  it('should return a hash on success', async () => {
    const SALT = 12
    const hashedValue = 'hashed_value'
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => hashedValue)
    const sut = new BcryptAdapter(SALT)

    const textToEncrypt = 'some value'
    const hash = await sut.encrypt(textToEncrypt)
    expect(hash).toEqual('hashed_value')
  })
})
