// reference : https://github.com/serverless/examples/blob/master/aws-node-dynamic-image-resizer/src/handlers/resizer/s3Handler.js
import { S3 } from 'aws-sdk'

const s3 = new S3()

export const readFileFromS3 = async ({ Bucket, Key }: { Bucket: string, Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err)
        return reject(err)
      }

      return resolve(data.Body)
    })
  })
}
