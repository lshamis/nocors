const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { endpoint } = event.queryStringParameters;

    if (!endpoint) {
        return {
            statusCode: 400,
            body: 'Endpoint parameter is required',
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        };
    }

    try {
        const response = await fetch(endpoint);
        const data = await response.text();
        
        return {
            statusCode: 200,
            body: data,
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*', // This allows any origin to access the function
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Failed fetching data: ${error.message}`,
            headers: {
                'Access-Control-Allow-Origin': '*', // This allows any origin to access the function
            }
        };
    }
};
