import { SignupController } from '.'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './protocols'
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (user: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'any-random-id',
        name: user.name,
        email: user.email,
        password: user.password
      }
      return await new Promise((resolve) => { resolve(fakeAccount) })
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignupController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'test-email@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'test-email@mail.com',
        passwordConfirmation: 'test-password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no confirmPassword is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'test-email@mail.com',
        password: 'test-password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if invalid email is provided', async () => {
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

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  it('should call email validator with provided email', async () => {
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

    await sut.handle(httpRequest)
    expect(invalidSpy).toBeCalledWith(httpRequest.body.email)
  })

  it('should return 500 if emailValidator throws', async () => {
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

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  it('should return 400 if password does not match passwordConfirmation', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'different-test-password'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should call create account with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'test@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith({
      name: 'test-name',
      email: 'test@mail.com',
      password: 'test-password'
    })
  })

  it('should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { throw new ServerError() })
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  it('should return 500 if addAccount throws', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test-name',
        email: 'invalid@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: 'any-random-id',
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })
})
