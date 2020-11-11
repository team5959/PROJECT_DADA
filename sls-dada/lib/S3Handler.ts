// reference : https://github.com/serverless/examples/blob/master/aws-node-dynamic-image-resizer/src/handlers/resizer/s3Handler.js
import { S3 } from 'aws-sdk'

const s3 = new S3()

export const readFileFromS3 = async ({ Bucket, Key }: { Bucket: string, Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.error(err)
        console.error(`Failed to get meta data of image file ${Bucket}/${Key}... skipped`)
        return reject()
      }

      return resolve(data.Body)
    })
  })
}
