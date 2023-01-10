import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Encrypter
} from './addAccount-protocols'

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (newAccountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(newAccountData.password)
    await this.addAccountRepository.add({ ...newAccountData, password: hashedPassword })
    return await new Promise((resolve) => { resolve(null) })
  }
}
