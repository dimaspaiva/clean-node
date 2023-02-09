import {
  HTTPRequest,
  HTTPResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/httpHelper'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        const missingParamError = new MissingParamError(field)
        console.error(missingParamError)
        return badRequest(missingParamError)
      }
    }

    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        const missingParamError = new MissingParamError('passwordConfirmation')
        console.error(missingParamError)
        return badRequest(missingParamError)
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })
      return created(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
