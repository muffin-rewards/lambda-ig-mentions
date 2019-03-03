const { sign } = require('./sign')
const { persist } = require('./persist')
const { LambdaException } = require('./exceptions')
const { getMediaTuples, fetchMedia } = require('./media')

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
  const respond = (status, body) => callback(null, { status, body, headers })

  try {
    // If the signatures don't match, this throws.
    sign(event.headers['X-Hub-Signature'], event.body)

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
    await persist(
      media.filter(m => m.isSome()),
    )
  } catch (error) {
    console.log(error)

    return respond(
      error instanceof LambdaException ? error.status : 500,
      error.message,
    )
  }
}
