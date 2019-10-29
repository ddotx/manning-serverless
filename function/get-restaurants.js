"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

async function getRestaurants(count) {
  let req = {
    TableName: tableName,
    Limit: count
  };
  //FIXME: REAL-WORLD === return the personalized list of top restaurants
// for each user based on location, rating, and order history
  let resp = await dynamodb.scan(req).promise();
  return resp.Items;
}


module.exports.handler = async event => {
  let restaurants = await getRestaurants(defaultResults);
  return {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  };
};
