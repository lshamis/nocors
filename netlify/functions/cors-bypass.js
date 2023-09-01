const { stream } = require("@netlify/functions");

exports.handler = stream(async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { endpoint, headers, compress } = JSON.parse(event.body);

  try {
    const response = await fetch(endpoint, {
      headers: headers || {},
    });

    if (compress) {
      return {
        statusCode: 200,
        headers: {
          "Content-Encoding": "gzip",
          "Content-Type": "application/octet-stream",
          "Access-Control-Allow-Origin": "*",
        },
        body: response.body.pipeThrough(new CompressionStream("gzip")),
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
        body: response.body,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch data",
        error: error.message,
      }),
    };
  }
});
