import { AddAccountRepository } from '../../protocols/addAccountRepository'
import { Encrypter } from '../../protocols/encrypter'
import { AccountModel, AddAccountModel } from './addAccount-protocols'
import { DBAddAccount } from './dbAddAccount'

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('hashed_password') })
    }
  }

  return new EncryptStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (newAccountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'test name',
        email: 'test@mail.com',
        password: 'test-password'
      }
      return await new Promise((resolve) => { resolve(fakeAccount) })
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  sut: DBAddAccount
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    encrypterStub,
    addAccountRepositoryStub,
    sut
  }
}

describe('DBAddAccount UseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  it('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    const sutPromise = sut.add(accountData)
    await expect(sutPromise).rejects.toThrow()
  })

  it('should call create AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    await sut.add(accountData)
    expect(addSpy).toBeCalledWith({ ...accountData, password: 'hashed_password' })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const accountData = {
      name: 'test name',
      email: 'test@mail.com',
      password: 'test-password'
    }

    const sutPromise = sut.add(accountData)
    await expect(sutPromise).rejects.toThrow()
  })
})
