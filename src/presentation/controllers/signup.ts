import {
  HTTPRequest,
  HTTPResponse,
  Controller,
  EmailValidator
} from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/httpHelper'
import { AddAccount } from '../../domain/useCases/addAccount'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HTTPRequest): HTTPResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new MissingParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}
