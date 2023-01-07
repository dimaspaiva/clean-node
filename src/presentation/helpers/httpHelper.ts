import { HTTPResponse } from '../protocols/http'

export const badRequest = (error: Error): HTTPResponse => ({
  statusCode: 400,
  body: error
})
