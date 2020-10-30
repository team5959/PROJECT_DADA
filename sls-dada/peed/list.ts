'use strict';

import {DynamoDB} from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: 'Peed',
        ExpressionAttributeNames: {
            '#user': 'User',
            '#date': 'Date',
        },
        ExpressionAttributeValues: {
            ':user': event.pathParameters.user,
            ':date': event.pathParameters.date,
        },
        KeyConditionExpression: '#user = :user AND begins_with(#date, :date)'
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

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};