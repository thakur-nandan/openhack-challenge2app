const fetch = require('node-fetch')
const uuidv1 = require('uuid/v4');
const {connect} = require('mongodb');
const assert = require('assert');


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log("UserID = " + req.body.userId + "productId = " + req.body.productId)
    const getUserEndPoint = "https://serverlessohuser.trafficmanager.net/api/GetUser?userId="

    let response = await fetch(getUserEndPoint+req.body.userId);
    let userDetails = await response.json()
    if(userDetails.userId) {
    	const getPdtEndPoint = "https://serverlessohproduct.trafficmanager.net/api/GetProduct?productId="
    	let PdtResponse = await fetch(getPdtEndPoint+req.body.productId);
    	let PdtDetails = await PdtResponse.json()

    	if(PdtDetails.productId) {
    		let id = uuidv1();
    		let timeStamp = new Date()

    		if(req.body.rating && Number.isInteger(parseInt(req.body.rating)) && parseInt(req.body.rating)>=0 && parseInt(req.body.rating)<=5){

    			//MongoDB Operation

    			const url = 'mongodb://challenge2:ALIe02eyXOBTDUgdYQw65YlWyJAbECu9Vshn6wjdjX8zderEFZyAwsH7KVWlDl7TwWSewBeaMWGKJecxpfsR6A%3D%3D@challenge2.documents.azure.com:10255/?ssl=true';

				// Database Name
				const dbName = 'challenge2-db';

				// Use connect method to connect to the Server
				let client = await connect(url)


				  // Insert a single document
				  let dbResponse = await client.db(dbName).collection('rating-collection').insertOne(
				  	{
					  "id": id,
					  "userId": req.body.userId,
					  "productId": req.body.productId,
					  "timestamp": timeStamp,
					  "locationName": "Sample ice cream shop",
					  "rating": parseInt(req.body.rating),
					  "userNotes": "I love the subtle notes of orange in this ice cream!"
					}
				  )
				  context.log(dbResponse.ops[0])
				  await client.close();
				  context.res = {
			            // status: 200, /* Defaults to 200 */
			            body: dbResponse.ops[0]
			        };
				  
				  

    		}else{
    			context.res = {body: "Please pass a valid integer rating between 1 and 5"};
    		}
    	}
    	else{
    		context.res = {body: "Please pass a valid productId on the query string"}
    	}
    }
    else{
    	context.res = {body: "Please pass a valid userId on the query string"}
    }

   
};