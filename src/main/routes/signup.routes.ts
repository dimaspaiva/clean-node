import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRoutesAdapter'
import { makeSignupController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
}
