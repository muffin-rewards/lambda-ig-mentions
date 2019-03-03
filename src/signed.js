const crypto = require('crypto')

/**
 * Checks if the signature is valid.
 *
 * @param {string} signature Authorization token
 * @param {string} body Raw event body
 * @return {boolean} Whether the signature is valid
 */
exports.signed = (signature, body) => {
  const hmac = crypto.createHmac('sha1', process.env.TOKEN)
  hmac.update(Buffer.from(body), 'utf-8')

  return signature === `sha1=${hmac.digest('hex')}`
}
