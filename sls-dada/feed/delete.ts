'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: 'feed',
    Key: {
      user: event.pathParameters.user,
      date: event.pathParameters.date
    }
  }

  dynamoDb.delete(params, (error, result) => {
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
      statusCode: 204
    }
    callback(null, response)
  })
}
