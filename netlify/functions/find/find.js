exports.handler = async (event, context) => {
  const name = event.queryStringParameters.name;
  // go to the root of the project
  let animal

  try {
    animal = require(`../../../data/${name.replace(' ', '_').toLowerCase()}.json`);
  } catch (e) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `No animal found with name ${name}`
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(animal)
  };
};