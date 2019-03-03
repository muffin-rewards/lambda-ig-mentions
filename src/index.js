const { sign } = require('./sign')
const { persist } = require('./persist')
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
  // TODO: Remove console log.
  console.log(event)

  /**
   * @param {number} status Http status to return
   * @param {string} body Response body
   */
  const respond = (status, body = '') => callback(null, { status, body, headers })

  try {
    // If the signatures don't match, this throws.
    sign(event.headers['X-Hub-Signature'], event.body)

    /**
     * @var {number} promoter Promoter id
     */
    const promoter = event.queryStringParameters.promoter_id

    if (!promoter) {
      throw new MissingPromoterIdException(422, 'Missing promoter id.')
    }

    /**
     * @var {any[]} entries New API mentions
     */
    const entries = JSON.parse(event.body).entry

    /**
     * Fetches media from Instagram APIs.
     *
     * @var {any[]} media Has information about each caption mention
     */
    const media = await Promise.all(
      getMediaTuples(entries).map(fetchMedia),
    )

    // Persists all valid fetched media.
    await Promise.all(
      media
        .filter(m => m.isSome())
        .map(m => persist(promoter, m))
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
