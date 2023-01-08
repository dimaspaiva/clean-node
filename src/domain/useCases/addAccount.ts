import { AccountModel } from '../models/account'

export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel
}

export type AddAccountModel = Omit<AccountModel, 'id'>
