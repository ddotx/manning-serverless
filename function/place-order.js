const AWS = require('aws-sdk')
const kinesis = new AWS.Kinesis()
const chance = require('chance').Chance()

const streamName = process.env.order_events_stream

module.exports.handler = async event => {
  let restaurantName = JSON.parse(event.body).restaurantName

  let userEmail = event.requestContext.authorizer.claims.email

  //FIXME: Dev - Generate a new order id 
  let orderId = chance.guid()
  console.log(`placing order ID [${orderId}] to [${restaurantName}] from user [${userEmail}]`)

  let data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: 'order_placed'
  }

  let putReq = {
    Data: JSON.stringify(data), //? SDK will automatically base64 encode the data
    PartitionKey: orderId,
    StreamName: streamName
  }
  await kinesis.putRecord(putReq).promise()

  console.log("published 'order_placed' event to Kinesis")

  return {
    statusCode: 200,
    body: JSON.stringify({orderId})
  }

}