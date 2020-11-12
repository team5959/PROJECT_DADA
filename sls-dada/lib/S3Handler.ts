// reference : https://github.com/serverless/examples/blob/master/aws-node-dynamic-image-resizer/src/handlers/resizer/s3Handler.js
import { S3 } from 'aws-sdk'

const s3 = new S3()

export const readFileFromS3 = async ({ Bucket, Key }: { Bucket: string, Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.error(`Failed to get file ${Bucket}/${Key} from S3... skipped`, err)
        return reject()
      }

      return resolve(data.Body)
    })
  })
}

export const deleteFileFromS3 = async ({ Bucket, Key }: { Bucket: string, Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.error(`Failed to delete file ${Bucket}/${Key} from S3... skipped`, err)
        return reject()
      }

      return resolve()
    })
  })
}

export const deleteFilesFromS3 = async ({ Bucket, Keys }: { Bucket: string, Keys: Array<string> }) => {
  const param: S3.DeleteObjectsRequest = {
    Bucket,
    Delete: {
      Objects: Keys.map(key => {
        return { Key: key }
      })
    }
  }

  return new Promise((resolve, reject) => {
    s3.deleteObjects(param, (err, data) => {
      if (err) {
        console.error(`Failed to delete files ${Bucket}/${Keys} from S3... skipped`, err)
        return reject()
      }

      return resolve()
    })
  })
}

export const deleteBucketFromS3 = async ({ Bucket }: { Bucket: string }) => {
  return new Promise((resolve, reject) => {
    s3.deleteBucket({ Bucket }, (err, data) => {
      if (err) {
        console.error(`Failed to delete Bucket ${Bucket} from S3... skipped`, err)
        return reject()
      }

      return resolve()
    })
  })
}
