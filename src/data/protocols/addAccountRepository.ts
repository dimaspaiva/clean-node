import { AddAccountModel } from '../../domain/useCases/addAccount'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
  add: (newAccountData: AddAccountModel) => Promise<AccountModel>
}
