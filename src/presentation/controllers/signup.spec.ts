import { SignupController } from './signup'

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'test-email@mail.com',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: name'))
  })

  it('should return 400 if no email is provided', () => {
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'test-name',
        password: 'test-password',
        passwordConfirmation: 'test-password'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: email'))
  })
})
