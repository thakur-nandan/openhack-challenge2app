const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  // Connection URL
  const url = 'mongodb://challenge2:ALIe02eyXOBTDUgdYQw65YlWyJAbECu9Vshn6wjdjX8zderEFZyAwsH7KVWlDl7TwWSewBeaMWGKJecxpfsR6A==@challenge2.documents.azure.com:10255/?ssl=true';
  
  // Database Name
  const dbName = 'challenge2-db';

  // COllection
  const collectionName = 'rating-collection';
  
  try {
    // Use connect method to connect to the Server
    /*
    let client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const col = db.collection('find');

    // Insert a single document
    //const r = await col.insertMany([{a:1}, {a:1}, {a:1}]);
    //assert.equal(3, r.insertedCount);

    // Get first two documents that match the query
    const docs = await col.find({}).limit(2).toArray();
    context.log('Length of the database is:' + docs.length);
    //assert.equal(2, docs.length);
    */
    
  } 
  catch (err) {
    console.log(err.stack);
  }

  if (client) {
    client.close();
  }

  if (req.query.name || (req.body && req.body.name)) {
      context.res = {
          // status: 200, /* Defaults to 200 */
          body: "Hello 2" + (req.query.name || req.body.name)
      };
  }
  else {
      context.res = {
          status: 400,
          body: "Please pass a name on the query string or in the request body"
      };
  }
};