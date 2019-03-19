const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB()

const { InvalidPromoterIdException } = require('./exceptions')

/**
 * Fetches user token from DynamoDB.
 *
 * @param {string} handle
 * @return {Promise<string>}
 */
exports.fetchToken = async (handle) => {
  return ddb.query({
    TableName: process.env.PROMOTERS_TABLE,
    ExpressionAttributeNames: {
      '#handle': 'handle',
    },
    ExpressionAttributeValues: {
      ':handle': { S: handle },
    },
    KeyConditionExpression: '#handle = :handle',
  }).promise()
    .then(({ Items }) => {
      if (Items && Items.length) {
        return Items.pop().token.S
      }

      throw new InvalidPromoterIdException
    })
}
