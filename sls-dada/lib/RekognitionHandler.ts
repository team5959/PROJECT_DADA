// Reference: https://github.com/serverless/examples/blob/master/aws-node-rekognition-analysis-s3-image/lib/imageAnalyser.js
import { Rekognition } from 'aws-sdk'

const rek = new Rekognition()

export const getImageLabelNames = async ({ Bucket, Key }): Promise<Array<string>> => {
  const params = {
    Image: {
      S3Object: {
        Bucket,
        Name: Key
      }
    },
    MaxLabels: 10,
    MinConfidence: 60
  }

  return new Promise((resolve, reject) => {
    rek.detectLabels(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data.Labels)
    })
  })
}
