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
    ExpressionAttributeValues: {
      ':tags': dynamoDb.createSet(data['tags']),
      ':S3Object': data['S3Object']
    },
    UpdateExpression: 'SET tags=:tags, S3Object=:S3Object'
  }

  if (data['location'] !== undefined) {
    params['ExpressionAttributeNames'] = {
      '#location': 'location'
    }
    params.ExpressionAttributeValues[':location'] = data['location']
    params.UpdateExpression = params.UpdateExpression.concat(', #location=:location')
  }

  if (data['title'] !== undefined) {
    params.ExpressionAttributeValues[':title'] = data['title']
    params.UpdateExpression = params.UpdateExpression.concat(', title=:title')
  }

  if (data['comment'] !== undefined) {
    if (params['ExpressionAttributeNames'] === undefined) {
      params['ExpressionAttributeNames'] = {
        '#comment': 'comment'
      }
    } else {
      params['ExpressionAttributeNames']['#comment'] = 'comment'
    }
    params.ExpressionAttributeValues[':comment'] = data['comment']
    params.UpdateExpression = params.UpdateExpression.concat(', #comment=:comment')
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
