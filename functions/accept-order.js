"use strict";

const AWS = require("aws-sdk");
const kinesis = new AWS.Kinesis();

const streamName = process.env.order_events_stream;

module.exports.handler = async event => {
  //TODO: Match POST Body
  let body = JSON.parse(event.body);
  let restaurantName = body.restaurantName;
  let orderId = body.orderId;
  let userEmail = body.userEmail;

  //FIXME:
  //! Implement authen for the accept-order
  //* Create a separate User Pool for restaurant users
  //* Authen the accept order endpoint

  console.log(
    `restaurant [${restaurantName}] accepted order ID [${orderId}] from user [${userEmail}]`
  );

  let data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: "order_accepted"
  };

  let req = {
    Data: JSON.stringify(data), // the SDK would base64 encode this for us
    PartitionKey: orderId,
    StreamName: streamName
  };

  await kinesis.putRecord(req).promise();

  console.log(`published 'order_accepted' event into Kinesis`);

  let response = {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  };

  return response
}

