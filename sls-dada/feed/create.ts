'use strict'

import { DynamoDB, Rekognition } from 'aws-sdk'
import * as exif from 'exif-parser'
import { readFileFromS3 } from '../lib/S3Handler'
import { getAddress } from '../lib/KakaoAPIHandler'
import { convertToDate } from '../lib/Util'
import { getImageLabelNames } from '../lib/RekognitionHandler'
import { insertFeedToDB } from '../lib/DynamoDBHandler'

const dynamoDB = new DynamoDB.DocumentClient()

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

const extractData = async (s3Objects: Array<S3Object>): Promise<Array<Photo>> => {
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

      if (result.tags['GPSLongitude'] !== undefined
        && !isNaN(result.tags['GPSLongitude'])
        && !isNaN(result.tags['GPSLatitude'])) {
        photo['gps'] = {
          lng: result.tags['GPSLongitude'],
          lat: result.tags['GPSLatitude']
        }
      }
    } catch (err) {
      console.log(err)
      console.error(`Failed to get meta data of image file ${o.Bucket}/${o.Key}... skipped`)
    }

    if (photo['gps'] !== undefined) {
      await getAddress(photo['gps'])
        .then((res) => {
          photo['location'] = res
        })
        .catch(() => {
          console.error(`Failed to get address from gps ${o.Bucket}/${o.Key}... skipped`)
        })
    }

    photo['tags'] = await getImageLabelNames(o)

    photos.push(photo)
  }

  return photos
}

const overallData = (photos: Array<Photo>): { location: string, tags: DynamoDB.DocumentClient.DynamoDbSet } => {
  let location = null
  const tagSet = new Set<string>()

  for (const photo of photos) {
    if (location === null && photo['location'] !== undefined) {
      location = photo['location']
    }
    photo.tags.map(tag => tagSet.add(tag))
  }

  const tags = dynamoDB.createSet([...tagSet])
  return { location, tags }
}

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const photos = await extractData(data['photos'])
  photos.sort(((a, b) => a.unixTime - b.unixTime))

  const { location, tags } = overallData(photos)

  const item = {
    user: event.pathParameters.user,
    date: data['date'],
    title: data['title'],
    contents: data['contents'],
    S3Object: photos[0].S3Object,
    photos,
    tags
  }

  if (location !== null) {
    item['location'] = location
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  }

  await insertFeedToDB(item)
    .catch((err) => {
      response['statusCode'] = err.statusCode || 501
      response['headers'] = { 'Content-Type': 'text/plain' }
      response['body'] = 'Couldn\'t upload to database'
    })

  callback(null, response)
}
