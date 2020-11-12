'use strict'

import { deleteFeedFromDB } from '../lib/DynamoDBHandler'
import { deleteFilesFromS3 } from '../lib/S3Handler'

module.exports.delete = async (event, context, callback) => {
  const response = {
    statusCode: 204
  }

  const deletedFeed = await deleteFeedFromDB({
    user: event.pathParameters.user,
    date: event.pathParameters.date
  })
    .catch((err) => {
      response['statusCode'] = err.statusCode || 501
      response['headers'] = { 'Content-Type': 'text/plain' }
      response['body'] = 'Couldn\'t delete from database'
    })

  const photos: Array<Object> = deletedFeed['photos']
  await deleteFilesFromS3({
    Bucket: `dada-${event.pathParameters.user}`,
    Keys: photos.map(photo => photo['S3Object']['Key'])
  })
    .catch((err) => {
      console.error(err)
    })

  callback(null, response)
}
