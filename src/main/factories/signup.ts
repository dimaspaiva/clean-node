import { BcryptAdapter } from '../../infra/criptography/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

import { DBAddAccount } from '../../data/useCases/addAccount/dbAddAccount'
import { EmailValidatorAdapter } from '../../utils/emailValidator-adapter'

import { SignupController } from '../../presentation/controllers/signup'

export const makeSignupController = (): SignupController => {
  const SALT = 12

  const encrypter = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()

  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DBAddAccount(encrypter, accountMongoRepository)
  return new SignupController(emailValidator, addAccount)
}
