const { sign } = require('./sign')
const { persist } = require('./persist')
const { fetchToken } = require('./fetchToken')
const { getMediaTuples, fetchMedia } = require('./media')
const { LambdaException, MissingPromoterIdException } = require('./exceptions')

/**
 * Access headers for CORs.
 *
 * @var {object} headers
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event, _, callback) => {
  /**
   * @param {number} statusCode Http statusCode to return
   * @param {string} body Response body
   */
  const respond = (statusCode, body = '') => callback(null, { statusCode, body, headers })

  try {
    // If the signatures don't match, this throws.
    sign(event.headers['X-Hub-Signature'], event.body)

    /**
     * @var {number} promoter Promoter id
     */
    const promoter = event.pathParameters.promoter

    if (!promoter) {
      throw new MissingPromoterIdException
    }

    /**
     * @var {any[]} entries New API mentions
     */
    const entries = JSON.parse(event.body).entry

    /**
     * @var {string} token Returns promoter's token.
     */
    const token = await fetchToken(promoter)

    /**
     * Fetches media from Instagram APIs.
     *
     * @var {any[]} media Has information about each caption mention
     */
    const media = await Promise.all(
      getMediaTuples(entries).map(entry => fetchMedia(token, entry)),
    )

    // Persists all valid fetched media.
    await Promise.all(
      media.map(o => o.mapOrElse(
        response => persist(promoter, response),
        () => Promise.resolve(),
      ))
    )

    respond(200)
  } catch (error) {
    console.log(error)

    return respond(
      error instanceof LambdaException ? error.status : 500,
      error.message,
    )
  }
}
