const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { endpoint } = event.queryStringParameters;

    // Check if endpoint is provided
    if (!endpoint) {
        return {
            statusCode: 400,
            body: 'Endpoint parameter is required'
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
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Failed fetching data: ${error.message}`
        };
    }
};

