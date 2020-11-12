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

export const deleteFeedFromDB = (Key: { user: string, date: string }) => {
  const params = {
    TableName: 'feed',
    Key,
    ReturnValues: 'ALL_OLD'
  }

  return new Promise((resolve, reject) => {
    dynamoDb.delete(params, (err, result) => {
      if (err) {
        console.error('Failed to delete data from DynamoDB', err)
        reject(err)
      }
      resolve(result.Attributes)
    })
  })
}
