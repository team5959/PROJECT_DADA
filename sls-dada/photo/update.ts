'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.update = (event, context, callback) => {
  // TODO RDS Update
  const data = JSON.parse(event.body)

  const params = {
    TableName: 'feed',
    Key: {
      user: event.pathParameters.user,
      date: event.pathParameters.date
    },
    ExpressionAttributeNames: {
      '#comment': 'comment'
    },
    ExpressionAttributeValues: {
      ':comment': data.comment,
      ':tags':  dynamoDb.createSet(data['tags'])
    },
    UpdateExpression: `SET photos[${event.pathParameters.photoIndex}].#comment = :comment,
                           photos[${event.pathParameters.photoIndex}].tags = :tags`,
    ReturnValues: 'ALL_NEW'
  }

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo items.'
      })
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    }
    callback(null, response)
  })
}
