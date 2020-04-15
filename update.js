import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async(event, context) => {
    const data = JSON.parse(event.body);
    console.log(data);
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition and sort key of the item to be updated
        // - 'userId': Identity Pool identity of the authenticated user
        // - 'noteId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":content": data.content || null
        },
        // 'UpdateExpresion' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachment = :attachment",
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update: you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW"
    };

    await dynamoDb.update(params);

    return {
        status: true
    };
});