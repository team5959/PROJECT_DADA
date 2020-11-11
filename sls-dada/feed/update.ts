'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body)

  const params = {
    TableName: 'feed',
    Key: {
      user: event.pathParameters.user,
      date: event.pathParameters.date
    },
    ExpressionAttributeNames: {
      '#location': 'location',
      '#comment': 'comment'
    },
    ExpressionAttributeValues: {
      ':location': data['location'],
      ':title': data['title'],
      ':comment': data['comment'],
      ':tags': dynamoDb.createSet(data['tags']),
      ':repPhoto': data['repPhoto']
    },
    UpdateExpression: 'SET #location=:location, title=:title, #comment=:comment, tags=:tags, repPhoto=:repPhoto'
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
      body: JSON.stringify(data)
    }
    callback(null, response)
  })
}
