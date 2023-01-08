import { HTTPRequest, HTTPResponse } from './http'

export interface Controller {
  handle: (httpRequest: HTTPRequest) => Promise<HTTPResponse>
}
