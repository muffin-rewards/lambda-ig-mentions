
class LambdaException extends Error {

  /**
   * @param {number} status Http status
   * @param {string} body Body to yield with the response
   */
  constructor (status, body) {
    super(body)
    this.status = status
  }

}

exports.LambdaException = LambdaException

exports.SignaturesMismatchException = class SignaturesMismatchException extends LambdaException {

  /**
   * @constructor
   */
  constructor () {
    super(401, 'Signature is not valid')
  }

}

exports.MissingPromoterIdException = class MissingPromoterIdException extends LambdaException {

  /**
   * @constructor
   */
  constructor () {
    super(422, 'Missing promoter id.')
  }

}

exports.InvalidPromoterIdException = class InvalidPromoterIdException extends LambdaException {

  /**
   * @constructor
   */
  constructor () {
    super(422, 'Invalid promoter id.')
  }

}
