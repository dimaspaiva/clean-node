import validator from 'validator'
import { EmailValidatorAdapter } from './emailValidator-adapter'

describe('Email validator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBeTruthy()
  })
})
