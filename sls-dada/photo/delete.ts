'use strict'

import { deletePhotoFromDB } from '../lib/DynamoDBHandler'
import { deleteFileFromS3 } from '../lib/S3Handler'

module.exports.delete = async (event, context, callback) => {
  const index = event.pathParameters.photoIndex
  const response = {
    statusCode: 200
  }

  const result = await deletePhotoFromDB({
    Key: {
      user: event.pathParameters.user,
      date: event.pathParameters.date
    },
    index
  })
    .catch((err) => {
      response['statusCode'] = err.statusCode || 501
      response['headers'] = { 'Content-Type': 'text/plain' }
      response['body'] = 'Couldn\'t upload to database'
    })

  await deleteFileFromS3(result['photos'][index]['S3Object'])
    .catch((err) => {
      console.error(err)
    })

  // 대표사진 바꿔주기
  if (result['photos'][index]['S3Object']['Key'] === result['S3Object']['Key']) {
    // 사진은 무조건 한 장 이상 포함 -> 삭제하는 인덱스가 0이면 1로, 아니면 0으로 대표 사진 바꾸기
    result['S3Object']['Key'] = result['photos'][Number(index) === 0 ? 1 : 0]['S3Object']['Key']
  }

  // 삭제한 사진 리턴 값에서 삭제
  result['photos'].splice(index, 1)

  response['body'] = JSON.stringify(result)

  callback(null, response)
}
