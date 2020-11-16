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

export const deletePhotoFromDB = ({ Key, index }: { Key: { user: string, date: string }, index: number}) => {
  let params = {
    TableName: 'feed',
    Key,
    UpdateExpression: `REMOVE photos[${index}]`,
    ReturnValues: 'ALL_OLD'
  }

  return new Promise((resolve, reject) => {
    dynamoDb.update(params, (err, result) => {
      if (err) {
        console.error('Failed to update data to DynamoDB', err)
        reject(err)
      }

      resolve(result.Attributes)
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
