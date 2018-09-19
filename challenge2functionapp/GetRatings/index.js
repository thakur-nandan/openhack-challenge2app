const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let userId = req.query.userId || (req.body && req.body.userId);

  if (!userId) {
    context.res = {
        status: 400,
        body: "Please pass a userId on the query string or in the request body"
    }
  }
  else {
    // Connection URL
    const url = 'mongodb://challenge2:ALIe02eyXOBTDUgdYQw65YlWyJAbECu9Vshn6wjdjX8zderEFZyAwsH7KVWlDl7TwWSewBeaMWGKJecxpfsR6A%3D%3D@challenge2.documents.azure.com:10255/?ssl=true';
      
    // Database Name
    const dbName = 'challenge2-db';

    // COllection
    const collectionName = 'rating-collection';

    // client reference
    let client;

    try {
      // Use connect method to connect to the Server
      client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const col = db.collection(collectionName);
    
      // Get all documents that match the query
      const docs = await col.find({"userId": userId}).toArray();
      context.log('Length of the database is:' + docs.length);

      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(docs)
      };
      //assert.equal(2, docs.length);
    } 
    catch (err) {
      console.log(err.stack);
    }

    if (client) {
      client.close();
    }
  }
};