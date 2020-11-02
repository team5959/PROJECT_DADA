'use strict';

import {DynamoDB} from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: 'feed',
        ExpressionAttributeNames: {
            '#user': 'user',
            '#date': 'date',
            '#location': 'location',
        },
        ExpressionAttributeValues: {
            ':user': event.pathParameters.user,
            ':date': event.pathParameters.date,
        },
        KeyConditionExpression: '#user = :user AND begins_with(#date, :date)',
        ProjectionExpression: 'id, #date, #location, title, tags, repPhoto',
        Select: 'SPECIFIC_ATTRIBUTES'
    };

    dynamoDb.query(params, (error, result) => {
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
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};
