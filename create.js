import * as uuid from "uuid";
//import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

//const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const main = handler(async(event, context) => {
    //request body es pasado como un string JSON encoded en 'event.body'

    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        // 'Item' contiene los atributos del item creado
        // - 'userId': Como no existe acceso a Cognito
        //			   vamos a usar para todos los requests el id: 1
        // - 'noteId': un Id unico de uuid
        // - 'content': tomado del request body
        // - 'attachment': tomado del request body
        // - 'createdAt': UNIX timestamp
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    };

    /*   dynamoDB.put(params, (error, data) => {
           //Configuramos los headers del response para permitir CORS

           const headers = {
               "Access-Control-Allow-Origin": "*",
               "Access-Control-Allow-Credentials": true
           };

           //Retorna error 500
           if (error) {
               const response = {
                   statusCode: 500,
                   headers: headers,
                   body: JSON.stringify({
                       status: false,
                       error: error
                   })
               };
               callback(null, response);
               return;
           }

           //Retorna status code 200 y el objeto creado
           const response = {
               statusCode: 200,
               headers: headers,
               body: JSON.stringify(params.Item)
           };
           callback(null, response);
       });*/

    await dynamoDb.put(params);
});