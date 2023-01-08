export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param name: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
