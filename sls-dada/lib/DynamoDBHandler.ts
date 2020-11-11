import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export const insertFeedToDB = (Item) => {
  const params = {
    TableName: 'feed',
    Item
  }

  return new Promise((resolve, reject) => {
    dynamoDb.put(params, (err, result) => {
      if (err) {
        console.error(err)
        console.error('Failed to put data to DynamoDB')
        reject(err)
      }

      resolve(result)
    })
  })
}
