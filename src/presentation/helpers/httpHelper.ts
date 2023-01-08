import { AccountModel } from '../controllers/signup/protocols'
import { ServerError } from '../errors'
import { HTTPResponse } from '../protocols/http'

export const badRequest = (error: Error): HTTPResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HTTPResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const created = (account: AccountModel): HTTPResponse => ({
  statusCode: 201,
  body: account
})
