const { Awi } = require('awi')
const { Some, None } = require('@bausano/data-structures')

/**
 * Awi base for fetching the content.
 *
 * @var {Awi} base
 */
const base = () => new Awi()
  .use(async req => req.base = 'https://graph.facebook.com')
  .use(async req => req.query.access_token = `${process.env.APP_ID}|${process.env.APP_SECRET}`)

/**
 * Which fields we want to store. For full list @see
 * https://developers.facebook.com/docs/instagram-api/reference/user/mentioned_media
 *
 * @var {string}
 */
const fields = [
  'caption',
  'comments_count',
  'like_count',
  'media_url',
  'timestamp',
  'username',
]

/**
 * Collects tuples of new IG posts with mentions.
 *
 * @return {Array<{ user: number, post: number }>}
 */
exports.getMediaTuples = (entries) => {
  return entries.reduce((tuples, entry) => {
    // Takes all changes (which are essentially mentions) and to tuples adds the
    // post id and id of the user that posted that picture.
    entry.changes.forEach((change) => {
      tuples.push({
        user: entry.id,
        post: change.value.media_id,
      })
    })
  }, [])
}

/**
 * Fetches data from Instagram APIs.
 *
 * @return {Promise<Optional<any>>}
 */
exports.fetchMedia = async ({ user, post }) => {
  return base()
    .use(async req => req.query.fields = `mentioned_media.media_id(${post}){${fields.join(',')}}`)
    .optional(user)
    .andThen(body => {
      // If checksum on the body keys does not match the requested fields length,
      // returns none. Otherwise return the mentioned media in some.
      return Object.keys(body.mentioned_media).length === fields.length
        ? new Some(body.mentioned_media)
        : new None
    })
}
