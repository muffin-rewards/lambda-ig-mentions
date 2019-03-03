
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
  //
}

exports.MissingPromoterIdException = class MissingPromoterIdException extends LambdaException {
  //
}
