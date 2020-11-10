'use strict'

import { DynamoDB, Rekognition } from 'aws-sdk'
import * as exif from 'exif-parser'
import { readFileFromS3 } from '../lib/S3Handler'
import { getAddress } from '../lib/KakaoAPIHandler'
import { convertToDate } from '../lib/Util'
import { getImageLabels } from '../lib/RekognitionHandler'

const dynamoDb = new DynamoDB.DocumentClient()

interface S3Object {
  Bucket: string,
  Key: string
}

interface Photo {
  date: string,
  unixTime: number,
  S3Object: S3Object,
  tags: Array<string>
}

interface Feed {
  user: string,
  date: string,
  location: string,
  title: string,
  tags: Array<string>,
  S3Object: S3Object,
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

      photo['unixTime'] = result.tags['CreateDate']
      photo['date'] = convertToDate(result.tags['CreateDate'])

      if ('GPSLongitude' in result.tags) {
        photo['gps'] = {
          lng: result.tags['GPSLongitude'],
          lat: result.tags['GPSLatitude']
        }

        photo['location'] = await getAddress(photo['gps'])
      }
    } catch (err) {
      console.error(`Failed to get meta data of image file ${o.Bucket}/${o.Key}... skipped`)
    }

    try {
      const labels: Array<Rekognition.Label> = await getImageLabels(o)
      photo['tags'] = labels.map(label => label.Name)
    } catch (err) {
      console.error(`Failed to detect labels of image file ${o.Bucket}/${o.Key}... skipped`)
      console.error(err)
    }
    photos.push(photo)
  }

  return photos
}

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const photos = await extractData(data['photos'])
  photos.sort(((a, b) => a.unixTime - b.unixTime))

  // TODO const { location, tags } = overallData(photos)

  const item = {
    user: event.pathParameters.user,
    date: data['date'],
    S3Object: photos[0].S3Object,
    photos
  }

  // if (location !== null) {
  //   item['location'] = location
  // }

  // TODO add title : n월 n일의 추억

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
    body: JSON.stringify(item)
  }
  callback(null, response)
}
