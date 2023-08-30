const fetch = require("node-fetch");
const vm = require("vm");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 400,
      body: "Invalid request method or empty body",
    };
  }

  const { endpoint, postProcessCode } = JSON.parse(event.body);

  if (!endpoint) {
    return {
      statusCode: 400,
      body: "No endpoint provided",
    };
  }

  const response = await fetch(endpoint);
  const data = await response.text();

  let result = data; // Default result

  if (postProcessCode) {
    const sandbox = { data };
    const script = new vm.Script(`postProcess = ${postProcessCode}`);
    script.runInNewContext(sandbox);

    // Call the provided function with the fetched data
    if (typeof sandbox.postProcess === "function") {
      result = sandbox.postProcess(data);
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
    body: result,
  };
};
