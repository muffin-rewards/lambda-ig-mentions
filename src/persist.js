const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB()

AWS.config.update({ region: 'eu-west-1' })

/**
 * Update/create media in DynamoDB.
 *
 * @param {number} promoter Promoter id
 * @param {any} media Posts to persist
 */
exports.persist = async (promoter, media) => {
  return ddb.updateItem({
    ExpressionAttributeValues: {
      ':at': { N: item.timestamp },
      ':cn': { S: item.caption },
      ':cs': { N: item.comments_count },
      ':l': { N: item.like_count },
      ':u': { S: item.media_url },
    },
    Key: {
      user: { S: media.username },
      promoter: { N: promoter },
    },
    ReturnValues: 'NONE',
    TableName: 'mentions',
    UpdateExpression: 'SET caption = :cn, comments = :cs, createdAt = :at, likes = :l, url = :u',
   }).promise().catch(e => console.log(e.message))
}
