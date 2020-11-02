'use strict';

import * as uuid from 'uuid';
import {DynamoDB} from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    const tags = dynamoDb.createSet(data.tags);
    delete data['tags'];

    const photos = data.photos;
    photos.forEach(item => {
        item.tags = dynamoDb.createSet(item.tags);
    })
    delete data['photos'];

    const params = {
        TableName: 'feed',
        Item: {
            tags: tags,
            photos: photos,
            ...data,
        }
    };

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t fetch the todo items.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};
