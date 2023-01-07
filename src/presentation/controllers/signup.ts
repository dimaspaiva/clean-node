import { HTTPRequest, HTTPResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'

export class SignupController {
  handle (httpRequest: HTTPRequest): HTTPResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
