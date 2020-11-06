'use strict'

import { DynamoDB, S3 } from 'aws-sdk'
import { ParsedPhoto, parsePhotos } from '../lib/FormdataHandler'

const dynamoDb = new DynamoDB.DocumentClient()

interface Photo {
  date: string,
  S3Object: S3.Object
}

interface Feed {
  user: string,
  date: string,
  location: string,
  title: string,
  tags: Array<string>,
  S3Object: S3.Object,
  photos: Array<Photo>
}

module.exports.create = async (event, context, callback) => {
  // Content-type: multipart/form-data
  const files = (await parsePhotos(event, callback))['null']

  // TODO get metadata from photos and divide to feeds (by location)

  // TODO for all feeds
  const data = {
    user: event.pathParameters.user
  }

  // TODO add photos (Date, S3Object, Tags)

  // TODO add S3Object (대표사진) : Earliest photo's S3Object
  // TODO add date : Earliest photo's date

  // TODO add location

  // TODO add title : n월 n일의 추억
  // TODO add tags : from photos.tags

  const params = {
    TableName: 'feed',
    Item: {
      ...data
    }
  }

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t upload to database'
      })
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}
