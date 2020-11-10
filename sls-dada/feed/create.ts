'use strict'

import { DynamoDB, S3 } from 'aws-sdk'
import * as exif from 'exif-parser'
import { readFileFromS3 } from '../lib/S3Handler'
import { getAddress } from '../lib/KakaoAPIHandler'

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

async function extractData (s3Objects: Array<S3Object>): Promise<Array<Photo>> {
  const photos = []

  for (const o of s3Objects) {
    const photo = {
      S3Object: o
    }
    const buffer = await readFileFromS3(o)
    const parser = exif.create(buffer)
    try {
      const result = parser.parse()

      // maybe it's the original timestamp...
      // result.tags.DateTimeOriginal or result.tags.CreateDate (long type -> need to casting)

      if ('GPSLongitude' in result.tags) {
        photo['gps'] = {
          lng: result.tags['GPSLongitude'],
          lat: result.tags['GPSLatitude']
        }
        photo['location'] = await getAddress(photo['gps'])
      }
    } catch (err) {
      console.error(`Image file ${o.Bucket}/${o.Key} doesn't have meta data... skipped`)
    }

    photos.push(photo)
  }

  return photos
}

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  // TODO divide to feeds (by location)
  const photos = await extractData(data['photos'])
  // console.log(feeds)

  const item = {
    user: event.pathParameters.user,
    photos: photos
  }
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
