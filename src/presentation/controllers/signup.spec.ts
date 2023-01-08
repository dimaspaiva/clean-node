import { SignupController } from './signup'
import { EmailValidator } from '../protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'test-email@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'test-email@mail.com',
        passwordConfirmation: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no confirmPassword is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'test-email@mail.com',
        password: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  it('should call email validator with provided email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const invalidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    sut.handle(httpRequest)
    expect(invalidSpy).toBeCalledWith(httpRequest.body.email)
  })

  it('should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new ServerError() })
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    const response = sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  it('should return 400 if password does not match passwordConfirmation', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'different-test-password'
      }
    }

    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
