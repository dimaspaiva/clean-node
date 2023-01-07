import { HTTPRequest, HTTPResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'

export class SignupController {
  handle (httpRequest: HTTPRequest): HTTPResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
