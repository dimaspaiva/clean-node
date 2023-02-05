import { Express } from 'express'
import { bodyParse } from '../middlewares/bodyParse'

export default (app: Express): void => {
  app.use(bodyParse)
}
