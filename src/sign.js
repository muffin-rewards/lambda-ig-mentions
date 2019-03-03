const crypto = require('crypto')
const { SignaturesMismatchException } = require('./exceptions')

/**
 * Checks if the signature is valid.
 *
 * @param {string} signature Authorization token
 * @param {string} body Raw event body
 * @throws {SignaturesMismatchException}
 */
exports.sign = (signature, body) => {
  const hmac = crypto.createHmac('sha1', process.env.APP_SECRET)
  hmac.update(Buffer.from(body), 'utf-8')

  if (signature === `sha1=${hmac.digest('hex')}`) {
    return
  }

  throw new SignaturesMismatchException(403, 'Signature is not valid')
}
