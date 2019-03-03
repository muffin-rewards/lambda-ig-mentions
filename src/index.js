const { signed } = require('./signed')

/**
 * Access headers for CORs.
 *
 * @var {object} headers
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
}

exports.handler = (event, _, callback) => {
  /**
   * @param {number} status Http status to return
   * @param {string} body Response body
   */
  const respond = (status, body) => callback(null, { status, body, headers })

  if (!signed(event.headers['X-Hub-Signature'], event.body)) {
    return respond(403, 'Signature is not valid')
  }


}
