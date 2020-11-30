'use strict';

const fs = require("fs")
const Mustache = require('mustache')
const http = require('superagent-promise')(require('superagent'),Promise)
const aws4 = require('aws4')
const URL = require('url')

const awsRegion = process.env.AWS_REGION
const cognitoUserPoolId = process.env.cognito_user_pool_id
const cognitoClientId = process.env.cognito_client_id;

const restaurantsApiRoot = process.env.restaurants_api
const ordersApiRoot = process.env.orders_api

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

var html; //* Cached static by global variables

async function loadHtml(){
  if (!html) {
    html = await fs.readFileSync('static/index.html','utf-8')
  }
  return html
}
//!=== Take advantage of container reuse to avoid loading static content,
//! or creating DB connection pools on every invocation

async function getRestaurants() {
  let url = URL.parse(restaurantsApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname
  };
  aws4.sign(opts);

  let httpReg = http
    .get(restaurantsApiRoot)
    .set('Host', opts.headers['Host'])
    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
    .set('Authorization', opts.headers['Authorization'])

  if (opts.headers["X-Amz-Security-Token"]) {
    httpReg.set("X-Amz-Security-Token", opts.headers["X-Amz-Security-Token"]);
  }
  return (await httpReg).body;
  // return (await http
  //   .get(restaurantsApiRoot)
  //   .set('Host', opts.headers['Host'])
  //   .set('X-Amz-Date', opts.headers['X-Amz-Date'])
  //   .set('Authorization', opts.headers['Authorization'])
  //   .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])
  //   ).body
}

module.exports.handler = async event => {
  let template = await loadHtml()
  let restaurants = await getRestaurants()
  let dayOfWeek = days[new Date().getDate()]
  
  //*--For Securing API endpoints
  let view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantsApiRoot}/search`,
    placeOrderUrl: `${ordersApiRoot}`
  }

  // let html = Mustache.render(template, { dayOfWeek, restaurants })
  let html = Mustache.render(template, view)

  // default will return as json, so overwrite with new header
  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };
};
