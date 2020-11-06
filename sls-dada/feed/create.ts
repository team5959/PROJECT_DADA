'use strict'

import { DynamoDB } from 'aws-sdk'
import * as stream from 'stream'
import * as multiparty from 'multiparty'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
  // Content-type: multipart/form-data
  const form = new multiparty.Form()

  let str = new stream.Readable()
  str.push(event.body)

  // multyparty needs lowercase header key
  const header = {}
  const keys = Object.keys(event.headers)
  for (let n = keys.length - 1; n >= 0; n--) {
    header[keys[n].toLowerCase()] = event.headers[keys[n]]
  }
  str['headers'] = header

  str.push(null)

  form.parse(str, (err, fields, files) => {
    if (err) {
      console.error(err)
      callback(null, {
        statusCode: err.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch image files.'
      })
    }

    console.log(files) // 사진 파일들
  })

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
