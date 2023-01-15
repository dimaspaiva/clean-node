import { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/addAccount'
import { MongoHelper } from '../helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository {
  async add (newAccountData: AddAccountModel): Promise<AccountModel> {
    return await MongoHelper.add<AccountModel>(newAccountData, 'accounts')
  }
}
