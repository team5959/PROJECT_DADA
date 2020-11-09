'use strict'

import { DynamoDB, S3 } from 'aws-sdk'
import * as exif from 'exif-parser'
import { readFileFromS3 } from '../lib/S3Handler'

const dynamoDb = new DynamoDB.DocumentClient()

interface S3Object {
  Bucket: string,
  Key: string
}

interface Photo {
  date: string,
  S3Object: S3Object,
  tags: Array<string>
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

async function groupingFeeds (s3Objects: Array<S3Object>): Promise<Array<Feed>> {
  const feeds: Array<Feed> = []

  let tmpAddr: string = ''
  for (const o of s3Objects) {
    const buffer = await readFileFromS3(o)
    const parser = exif.create(buffer)
    try {
      const result = parser.parse()
      // now we can use gps from result
      // -> result.tags.GPSLatitude, result.tags.GPSLongitude (double type)
      // ; if it's not exist, not use this photo
      // maybe we should check that photos from gallery (app) have gps information (I have to manual export from mac photos app to get gps info)

      // maybe it's the original timestamp...
      // result.tags.DateTimeOriginal or result.tags.CreateDate (long type -> need to casting)
    } catch (err) {
      console.error(`Image file ${o.Bucket}/${o.Key} dosen't have gps info... skipped`)
    }
  }

  return feeds
}

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  // TODO divide to feeds (by location)
  const feeds = await groupingFeeds(data['photos'])
  // console.log(feeds)

  // // TODO for all feeds
  // const item = {
  //   user: event.pathParameters.user
  // }
  //
  // // TODO add photos (Date, S3Object, Tags)
  //
  // // TODO add S3Object (대표사진) : Earliest photo's S3Object
  // // TODO add date : Earliest photo's date
  //
  // // TODO add location
  //
  // // TODO add title : n월 n일의 추억
  // // TODO add tags : from photos.tags
  //
  // const params = {
  //   TableName: 'feed',
  //   Item: {
  //     ...item
  //   }
  // }
  //
  // dynamoDb.put(params, (error, result) => {
  //   if (error) {
  //     console.error(error)
  //     callback(null, {
  //       statusCode: error.statusCode || 501,
  //       headers: { 'Content-Type': 'text/plain' },
  //       body: 'Couldn\'t upload to database'
  //     })
  //     return
  //   }
  //
  //   const response = {
  //     statusCode: 200,
  //     body: JSON.stringify(params.Item)
  //   }
  //   callback(null, response)
  // })
  const response = {
    statusCode: 200,
    body: JSON.stringify('hi')
  }
  callback(null, response)
}
