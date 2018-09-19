const fetch = require('node-fetch')
const uuidv1 = require('uuid/v4');
const {connect} = require('mongodb');
const assert = require('assert');


module.exports = async function (context, req) {

    if(req.body && req.body.userId && req.body.productId)
    {



        context.log('JavaScript HTTP trigger function processed a request.');
        context.log("UserID = " + req.body.userId + "productId = " + req.body.productId)
        const getUserEndPoint = "https://serverlessohuser.trafficmanager.net/api/GetUser?userId="

        let response = await fetch(getUserEndPoint+req.body.userId);
        let userDetails;
        let PdtDetails;

        try{
                userDetails = await response.json()
                
                    const getPdtEndPoint = "https://serverlessohproduct.trafficmanager.net/api/GetProduct?productId="
                    let PdtResponse = await fetch(getPdtEndPoint+req.body.productId);
                    try{
                            PdtDetails = await PdtResponse.json()

                            let id = uuidv1();
                            let timeStamp = new Date()

                            if(req.body.rating && Number.isInteger(parseInt(req.body.rating)) && parseInt(req.body.rating)>=0 && parseInt(req.body.rating)<=5){

                                //MongoDB Operation

                                const url = process.env["DB_Connection_String"];

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
                        catch(error){
                            context.res = {
                                    status: 400, /* Defaults to 200 */
                                    body: "Please Enter valid Product ID " + error
                                };
                        }                   
                

            }
            catch(error){
                context.res = {
                        status: 400, /* Defaults to 200 */
                        body: "Please enter valid user ID " + error
                    };
                    }}
    else{
                context.res = {
                    status: 404,
                    body: "Please enter ProductId and userId"
                }
            }

   
};