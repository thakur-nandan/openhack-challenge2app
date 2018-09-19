const {connect} = require('mongodb');
const assert = require('assert');

module.exports = async function (context, req) {


  if (req.query.id || (req.body && req.body.id)) {

        context.log('JavaScript HTTP trigger function processed a request.');

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
          
          let client = await connect(url);
          const db = client.db(dbName);
          const col = db.collection(collectionName);

          // Insert a single document
          //const r = await col.insertMany([{a:1}, {a:1}, {a:1}]);
          //assert.equal(3, r.insertedCount);

          // Get first two documents that match the query
          const docs = await col.find({id:req.query.id}).limit(1).toArray();
          //assert.equal(2, docs.length);
          context.log("Docs : ", docs.length)
          if(docs.length===0)
          {
            context.log("Zero length Encountered")
             context.res = {
                status: 400,
                body: "Id not found in DB"
              };
          }
          else{
            context.res = {
                  body: docs[0]
              };
          }
        } 
        catch (err) {
          console.log(err.stack);
        }

        if (client) {
          client.close();
        }

        

  }
  else {
      context.res = {
          status: 400,
          body: "Please pass an id on the query string or in the request body"
      };
  }
};