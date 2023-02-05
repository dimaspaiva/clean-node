import { Express } from 'express'

import { bodyParse } from '../middlewares/bodyParse'
import { cors } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParse)
  app.use(cors)
}
