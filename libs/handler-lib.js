export default function handler(lambda) {
    return function(event, context) {
        return Promise.resolve()
            //Ejecuta Lambda
            .then(() => lambda(event, context))
            //On success
            .then((responseBody) => [200, responseBody])
            //On failure
            .catch((e) => {
                return [500, {
                error: e.message
                }];
            })
            .then(([statusCode, body]) => ({
                statusCode,
                headers: {
                    "Acces-Control-Allow-Origin": "*",
                    "Acces-Control-Allow-Credentials": true,
                },
                body: JSON.stringify(body),
            }));
    };
}