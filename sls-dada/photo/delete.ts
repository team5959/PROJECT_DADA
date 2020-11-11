'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.delete = (event, context, callback) => {
  let params = {
    TableName: 'feed',
    Key: {
      user: event.pathParameters.user,
      date: event.pathParameters.date
    },
    UpdateExpression: `REMOVE photos[${event.pathParameters.photoIndex}]`,
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
