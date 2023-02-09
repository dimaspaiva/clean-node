import { Request, Response } from 'express'
import { Controller, HTTPRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return (req: Request, res: Response) => {
    const httpRequest: HTTPRequest = {
      body: req.body
    }

    void controller.handle(httpRequest).then((httpResponse) => {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    })
  }
}
