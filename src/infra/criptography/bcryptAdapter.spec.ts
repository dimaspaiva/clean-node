import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

const SALT = 12

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(SALT)
  return sut
}

describe('Bcrypt adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')

    const textToEncrypt = 'some value'
    await sut.encrypt(textToEncrypt)
    expect(encryptSpy).toBeCalledWith(textToEncrypt, SALT)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()
    const hashedValue = 'hashed_value'
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => hashedValue)

    const textToEncrypt = 'some value'
    const hash = await sut.encrypt(textToEncrypt)
    expect(hash).toEqual('hashed_value')
  })
})
